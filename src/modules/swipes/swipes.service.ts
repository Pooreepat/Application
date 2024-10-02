import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Swipe, SwipeDocument } from './swipes.schema';
import { SwipeCreateDto } from './dto/swipes-create.dto';

@Injectable()
export class SwipeService {
  constructor(
    @InjectModel(Swipe.name) private swipeModel: Model<SwipeDocument>,
  ) {}

  async create(createSwipeDto: SwipeCreateDto): Promise<Swipe> {
    const createdSwipe = new this.swipeModel(createSwipeDto);
    return createdSwipe.save();
  }

  async findByFilter(filter: Partial<SwipeDocument>): Promise<Swipe> {
    return this.swipeModel.findOne(filter as FilterQuery<SwipeDocument>).exec();
  }

  async findAll(): Promise<Swipe[]> {
    return this.swipeModel.find().exec();
  }

  async findOne(id: string): Promise<Swipe> {
    const swipe = await this.swipeModel.findById(id).exec();
    if (!swipe) {
      throw new NotFoundException(`การสไลด์ ID ${id} ไม่พบ`);
    }
    return swipe;
  }

  async update(id: string, updateData: Partial<SwipeDocument>): Promise<Swipe> {
    const swipe = await this.swipeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!swipe) {
      throw new NotFoundException(`การสไลด์ ID ${id} ไม่พบ`);
    }
    return swipe;
  }

  async remove(id: string): Promise<void> {
    const result = await this.swipeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`การสไลด์ ID ${id} ไม่พบ`);
    }
  }

  async getSwipedPetsByUser(userId: Types.ObjectId) {
    return this.swipeModel
      .find({ _swiperId: userId })
      .select('_swipedPetId')
      .exec();
  }
}
