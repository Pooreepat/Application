import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from './matches.schema';
import { IMatch } from './matches.interface';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    skip: number,
    perPage: number,
    isPet: boolean = true,
  ): Promise<[MatchDocument[], number]> {
    const pipeline: any[] = [
      { $match: filterQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: perPage },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile1Id',
          foreignField: '_id',
          as: 'profile1',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile2Id',
          foreignField: '_id',
          as: 'profile2',
        },
      },
      {
        $lookup: {
          from: 'pets',
          localField: '_petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      { $unwind: { path: '$profile1', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$profile2', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
    ];

    if (!isPet) {
      pipeline.push(
        {
          $group: {
            _id: '$pet._id',
            match: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$match' },
        },
      );
    }

    const matches = await this.matchModel.aggregate(pipeline).exec();

    const total = await this.matchModel.countDocuments(filterQuery);

    return [matches, total];
  }

  public async getMatchById(id: Types.ObjectId): Promise<MatchDocument> {
    const match = await this.matchModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile1Id',
          foreignField: '_id',
          as: 'profile1',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile2Id',
          foreignField: '_id',
          as: 'profile2',
        },
      },
      {
        $lookup: {
          from: 'pets',
          localField: '_petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      { $unwind: { path: '$profile1', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$profile2', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
      { $limit: 1 },
    ]);
    return match.length > 0 ? match[0] : null;
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
  ): Promise<IMatch> {
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true })
      .exec();
    if (!updatedMatch) {
      throw new NotFoundException('ไม่สามารถอัปเดตการแข่งขันได้');
    }
    return updatedMatch;
  }

  async delete(id: Types.ObjectId): Promise<void> {
    const result = await this.matchModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('ไม่สามารถลบการแข่งขันได้');
    }
  }

  async removeMatches(
    petId: Types.ObjectId,
    matchId: Types.ObjectId,
  ): Promise<void> {
    await this.matchModel.deleteMany({ _petId: petId, _id: { $ne: matchId } });
  }
}
