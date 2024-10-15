import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Preference, PreferenceDocument } from './preference.schema';
import { PreferenceCreateDto } from './dto/preference-create.dto';
import { PreferenceUpdateDto } from './dto/preference-update.dto';
import { IPreference } from './preference.interface';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel(Preference.name)
    private preferenceModel: Model<PreferenceDocument>,
  ) {}

  async createPreference(
    createPreferenceDto: Partial<PreferenceDocument>,
  ): Promise<Preference> {
    const createdPreference = new this.preferenceModel(createPreferenceDto);
    return createdPreference.save();
  }

  async findByProfileId(profileId: Types.ObjectId): Promise<IPreference[]> {
    return this.preferenceModel.find({ profileId }).lean();
  }

  async findAll(): Promise<Preference[]> {
    return this.preferenceModel.find().exec();
  }

  async findOne(id: string): Promise<Preference> {
    const preference = await this.preferenceModel.findById(id).exec();
    if (!preference) {
      throw new NotFoundException(`การตั้งค่า ID ${id} ไม่พบ`);
    }
    return preference;
  }

  async update(
    id: Types.ObjectId,
    updatePreferenceDto: Partial<PreferenceDocument>,
  ): Promise<Preference> {
    const preference = await this.preferenceModel
      .findByIdAndUpdate(id, updatePreferenceDto, { new: true })
      .exec();
    if (!preference) {
      throw new NotFoundException(`การตั้งค่า ID ${id} ไม่พบ`);
    }
    return preference;
  }

  async remove(id: string): Promise<void> {
    const result = await this.preferenceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`การตั้งค่า ID ${id} ไม่พบ`);
    }
  }
}
