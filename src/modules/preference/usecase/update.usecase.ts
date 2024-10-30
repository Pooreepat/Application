import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PreferenceService } from '../preference.service';
import { PreferenceCreateDto } from '../dto/preference-create.dto';
import { Types } from 'mongoose';
import { HttpRespons } from 'src/interface/respones';
import { PreferenceUpdateDto } from '../dto/preference-update.dto';

@Injectable()
export class UpdatePreferenceUsecase {
  constructor(
    private readonly preferenceService: PreferenceService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: PreferenceUpdateDto & { id: Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const preference = await this.preferenceService.update(
        new Types.ObjectId(data.id),
        {
          species: data.species,
          size: data.size,
          isSpayedOrNeutered: data.isSpayedOrNeutered,
          breed: data.breed,
          generalHealth: data.generalHealth,
          tags: data.tags,
          gender: data.gender,
          vaccinationHistory: data.vaccinationHistory,
          minBirthdayAt: new Date(data.minBirthdayAt),
          maxBirthdayAt: new Date(data.maxBirthdayAt),
        },
      );

      if (!preference) {
        throw new HttpException('ไม่สามารถแก้ไขความสนใจได้', 500);
      }

      return {
        message: 'แก้ไขความสนใจสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
