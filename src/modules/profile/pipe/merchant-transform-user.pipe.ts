import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { IProfile } from '../profile.interface';
import { ProfileService } from '../profile.service';
import { Types } from 'mongoose';

@Injectable()
export class ProfileTransformUserPipe<T> implements PipeTransform {
  constructor(private readonly profileService: ProfileService) {}

  async transform(data: T & { _id: string }): Promise<
    T & {
      profile: IProfile;
    }
  > {
    const { _id } = data;
    try {
      const profile = await this.profileService.getProfileByUserId(new Types.ObjectId(_id));
      if (!profile) {
        throw new BadRequestException('ไม่พบโปรไฟล์ของผู้ใช้งาน');
      }
      return {
        ...data,
        profile,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
