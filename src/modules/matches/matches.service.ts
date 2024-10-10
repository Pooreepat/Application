import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from './matches.schema';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    skip: number,
    perPage: number,
  ): Promise<[MatchDocument[], number]> {
    const matches = await this.matchModel
      .aggregate([
        { $match: filterQuery }, // Filter based on the provided query
        { $sort: { createdAt: -1 } }, // Sort by creation date
        { $skip: skip }, // Skip the number of records for pagination
        { $limit: perPage }, // Limit the number of records per page
        {
          $lookup: {
            from: 'profiles', // The collection for Profile
            localField: '_profile1Id', // Field in the Match schema
            foreignField: '_id', // Field in the Profile collection
            as: 'profile1', // Name of the joined field
          },
        },
        {
          $lookup: {
            from: 'profiles', // The collection for Profile
            localField: '_profile2Id', // Field in the Match schema
            foreignField: '_id', // Field in the Profile collection
            as: 'profile2', // Name of the joined field
          },
        },
        {
          $lookup: {
            from: 'pets', // The collection for Pet
            localField: '_petId', // Field in the Match schema
            foreignField: '_id', // Field in the Pet collection
            as: 'pet', // Name of the joined field
          },
        },
        { $unwind: { path: '$profile1', preserveNullAndEmptyArrays: true } }, // Unwind the first profile
        { $unwind: { path: '$profile2', preserveNullAndEmptyArrays: true } }, // Unwind the second profile
        { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } }, // Unwind the pet
      ])
      .exec();

    const total = await this.matchModel.countDocuments(filterQuery); // Total count

    return [matches, total];
  }

  async create(createMatchDto: Partial<MatchDocument>): Promise<Match> {
    const match = new this.matchModel(createMatchDto);
    return match.save();
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }

  async findOne(id: string): Promise<Match> {
    const match = await this.matchModel.findById(id).exec();
    if (!match) {
      throw new NotFoundException('ไม่พบการแข่งขัน');
    }
    return match;
  }

  async update(
    id: Types.ObjectId,
    updateMatchDto: Partial<MatchDocument>,
  ): Promise<Match> {
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true })
      .exec();
    if (!updatedMatch) {
      throw new NotFoundException('ไม่สามารถอัปเดตการแข่งขันได้');
    }
    return updatedMatch;
  }

  async delete(id: string): Promise<void> {
    const result = await this.matchModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('ไม่สามารถลบการแข่งขันได้');
    }
  }
}
