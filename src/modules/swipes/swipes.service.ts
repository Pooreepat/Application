import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Swipe, SwipeDocument } from './swipes.schema';
import { ISwipe } from './swipes.interface';
import { IPet } from '../pet/pet.interface';
import { IUser } from '../user/interfaces/user.interface';

@Injectable()
export class SwipeService {
  constructor(
    @InjectModel(Swipe.name) private swipeModel: Model<SwipeDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    page: number,
    perPage: number,
  ): Promise<[SwipeDocument[], number]> {
    const data = await this.swipeModel
      .aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: 'user',
            localField: '_adopterId',
            foreignField: '_id',
            as: 'adopter',
          },
        },
        {
          $lookup: {
            from: 'pet',
            localField: '_petId',
            foreignField: '_id',
            as: 'pet',
          },
        },
        { $unwind: { path: '$adopter', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: 1 } },
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ])
      .exec();
    const total = await this.swipeModel.countDocuments(filterQuery);
    return [data, total];
  }

  public async createSwipe(data: Partial<ISwipe>): Promise<SwipeDocument> {
    return this.swipeModel.create(data);
  }

  public async updateSwipe(
    swipeId: Types.ObjectId,
    data: Partial<ISwipe>,
  ): Promise<SwipeDocument> {
    return this.swipeModel
      .findByIdAndUpdate(swipeId, data, { new: true })
      .lean();
  }

  public async getSwipedByAdopterId(
    adopterId: Types.ObjectId,
  ): Promise<SwipeDocument[]> {
    return this.swipeModel.find({ _adopterId: adopterId }).lean();
  }

  public async getSwipeByPetIdAndAdopterId(
    petId: Types.ObjectId,
    adopterId: Types.ObjectId,
  ): Promise<SwipeDocument> {
    return this.swipeModel
      .findOne({ _petId: petId, _adopterId: adopterId })
      .lean();
  }

  public async getSwipeById(
    swipeId: Types.ObjectId,
  ): Promise<SwipeDocument & { pet: IPet; adopter: IUser }> {
    const swipe = await this.swipeModel
      .aggregate([
        { $match: { _id: swipeId } },
        {
          $lookup: {
            from: 'user',
            localField: '_adopterId',
            foreignField: '_id',
            as: 'adopter',
          },
        },
        {
          $lookup: {
            from: 'pet',
            localField: '_petId',
            foreignField: '_id',
            as: 'pet',
          },
        },
        { $unwind: { path: '$adopter', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
        { $limit: 1 },
      ])
      .exec();
    return swipe[0];
  }
}
