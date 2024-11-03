import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './messages.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    page: number,
    perPage: number,
  ): Promise<[MessageDocument[], number]> {
    const data = await this.messageModel
      .aggregate([
        { $match: filterQuery },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ])
      .exec();
    const total = await this.messageModel.countDocuments(filterQuery);
    return [data, total];
  }

  async create(createMessageDto: Partial<MessageDocument>): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async update(
    id: string,
    data: Partial<MessageDocument>,
  ): Promise<Message> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedMessage) {
      throw new NotFoundException('ไม่สามารถอัปเดตได้ ไม่พบข้อความ');
    }
    return updatedMessage;
  }

  async delete(id: string): Promise<void> {
    const result = await this.messageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('ไม่สามารถลบได้ ไม่พบข้อความ');
    }
  }
}
