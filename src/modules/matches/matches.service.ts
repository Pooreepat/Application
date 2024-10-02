import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();
    const total = await this.matchModel.countDocuments(filterQuery);
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
    id: string,
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
