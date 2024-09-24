import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  public async getPagination(
    skip: number,
    perPage: number,
  ): Promise<[ProfileDocument[], number]> {
    const profiles = await this.profileModel
      .find()
      .skip(skip)
      .limit(perPage)
      .lean();
    const total = await this.profileModel.countDocuments();
    return [profiles, total];
  }

  public async getProfileById(profileId: string): Promise<ProfileDocument> {
    return this.profileModel.findById(profileId).lean();
  }

  public async getProfileByUserId(userId: string): Promise<ProfileDocument> {
    return this.profileModel.findOne({ user: userId }).lean();
  }

  public async createProfile(data: ProfileDocument): Promise<ProfileDocument> {
    return this.profileModel.create(data);
  }

  public async updateProfile(
    profileId: string,
    data: any,
  ): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndUpdate(profileId, data, { new: true });
  }
}
