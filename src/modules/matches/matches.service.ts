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
    page: number,
    perPage: number,
  ): Promise<[MatchDocument[], number]> {
    const data = await this.matchModel
      .aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: 'user',
            localField: '_caretakerId',
            foreignField: '_id',
            as: 'caretaker',
          },
        },
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
        { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$adopter', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: 1 } },
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ])
      .exec();
    const total = await this.matchModel.countDocuments(filterQuery);
    return [data, total];
  }

  public async createMatch(data: Partial<MatchDocument>): Promise<Match> {
    const match = new this.matchModel(data);
    return match.save();
  }

  public async findMatchById(id: Types.ObjectId): Promise<IMatch> {
    const match = await this.matchModel.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'user',
          localField: '_caretakerId',
          foreignField: '_id',
          as: 'caretaker',
        },
      },
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
      { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$adopter', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
      { $limit: 1 },
    ]).exec();
    if (!match) {
      throw new NotFoundException('ไม่พบการจับคู่');
    }
    return match[0];
  }

  public async updateMatch(
    id: Types.ObjectId,
    data: Partial<MatchDocument>,
  ): Promise<IMatch> {
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedMatch) {
      throw new NotFoundException('ไม่สามารถอัปเดตการแข่งขันได้');
    }
    return updatedMatch;
  }

  async removeMatches(
    petId: Types.ObjectId,
    matchId: Types.ObjectId,
  ): Promise<void> {
    await this.matchModel.deleteMany({ _petId: petId, _id: { $ne: matchId } });
  }
}
