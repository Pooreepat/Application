import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Preference, PreferenceDocument } from './preference.schema';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel(Preference.name)
    private preferenceModel: Model<PreferenceDocument>,
  ) {}

  public async getPreferenceById(
    profileId: string,
  ): Promise<PreferenceDocument> {
    return this.preferenceModel.findById(profileId).lean();
  }

  public async getPreferenceByProfileId(
    userId: string,
  ): Promise<PreferenceDocument> {
    return this.preferenceModel.findOne({ user: userId }).lean();
  }

  public async createPreference(
    data: PreferenceDocument,
  ): Promise<PreferenceDocument> {
    return this.preferenceModel.create(data);
  }

  public async updatePreference(
    profileId: string,
    data: any,
  ): Promise<PreferenceDocument> {
    return this.preferenceModel.findByIdAndUpdate(profileId, data, {
      new: true,
    });
  }
}
