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
    filterUser: any,
    skip: number,
    perPage: number,
  ): Promise<[ProfileDocument[], number]> {
    const profiles = await this.profileModel.aggregate([
      {
        $match: filterQuery,
      },
      {
        $lookup: {
          from: 'user',
          localField: '_userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: filterUser,
      },
      {
        $project: {
          user: 0,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: perPage,
      },
    ]);

    const total = await this.profileModel.countDocuments(filterQuery);
    return [profiles, total];
  }

  public async getProfileById(id: Types.ObjectId): Promise<any> {
    const profile = await this.profileModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: '_userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          email: '$user.email',
        },
      },
      {
        $project: {
          user: 0,
        },
      },
      {
        $limit: 1,
      },
    ]);

    return profile[0];
  }

  public async getProfileByUserId(
    userId: Types.ObjectId,
  ): Promise<ProfileDocument> {
    return this.profileModel.findOne({ _userId: userId }).lean();
  }

  public async createProfile(data: Partial<ProfileDocument>): Promise<ProfileDocument> {
    return this.profileModel.create(data);
  }

  public async updateProfile(
    profileId: string | Types.ObjectId,
    data: Partial<IProfile>,
  ): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndUpdate(profileId, data, { new: true });
  }

  public async deleteProfile(id: Types.ObjectId): Promise<ProfileDocument> {
    return this.profileModel.findByIdAndDelete(id);
  }
}
