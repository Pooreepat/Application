import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './profile.schema';
import { Model, Types } from 'mongoose';
import { IProfile, IProfileCreate } from './profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    skip: number,
    perPage: number,
  ): Promise<[ProfileDocument[], number]> {
    const profiles = await this.profileModel
      .find(filterQuery)
      .skip(skip)
      .limit(perPage)
      .lean();
    const total = await this.profileModel.countDocuments(filterQuery);
    return [profiles, total];
  }

  public async getProfileById(id: string | Types.ObjectId): Promise<ProfileDocument> {
    return this.profileModel.findById(id).lean();
  }

  public async getProfileByUserId(userId: string): Promise<ProfileDocument> {
    return this.profileModel.findOne({ _userId: userId }).lean();
  }

  public async createProfile(data: IProfileCreate): Promise<ProfileDocument> {
    return this.profileModel.create(data);
  }

  public async updateProfile(
    profileId: string | Types.ObjectId,
    data: Partial<IProfile>,
  ): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndUpdate(profileId, data, { new: true });
  }
}
