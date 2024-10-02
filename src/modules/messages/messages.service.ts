import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './messages.schema';
import { MessageCreateDto } from './dto/message-create.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    skip: number,
    perPage: number,
  ): Promise<[MessageDocument[], number]> {
    const message = await this.messageModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();
    const total = await this.messageModel.countDocuments(filterQuery);
    return [message, total];
  }

  async create(createMessageDto: Partial<MessageDocument>): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException('ไม่พบข้อความ');
    }
    return message;
  }

  async update(
    id: string,
    updateMessageDto: MessageCreateDto,
  ): Promise<Message> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, { new: true })
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
