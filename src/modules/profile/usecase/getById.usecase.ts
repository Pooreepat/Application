import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile.service';
import { Types } from 'mongoose';
import { IProfile } from '../profile.interface';

@Injectable()
export class GetByIdProfileUsecase {
  constructor(
    private readonly profileService: ProfileService,
    readonly configService: ConfigService,
  ) {}

  public async execute(id: Types.ObjectId): Promise<IProfile> {
    try {
      const profile = await this.profileService.getProfileById(new Types.ObjectId(id));

      if (!profile) {
        throw new HttpException('ไม่พบโปรไฟล์', 404);
      }

      return profile;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
