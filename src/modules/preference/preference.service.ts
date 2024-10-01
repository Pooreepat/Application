import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Preference, PreferenceDocument } from './preference.schema';
import { PreferenceCreateDto } from './dto/preference-create.dto';
import { PreferenceUpdateDto } from './dto/preference-update.dto';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel(Preference.name) private preferenceModel: Model<PreferenceDocument>,
  ) {}

  async create(createPreferenceDto: PreferenceCreateDto): Promise<Preference> {
    const createdPreference = new this.preferenceModel(createPreferenceDto);
    return createdPreference.save();
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

  async update(id: string, updatePreferenceDto: PreferenceUpdateDto): Promise<Preference> {
    const preference = await this.preferenceModel.findByIdAndUpdate(id, updatePreferenceDto, { new: true }).exec();
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
