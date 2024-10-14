import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from '../profile.service';
import { Types } from 'mongoose';
import { IProfile } from '../profile.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class DeleteProfileUsecase {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    readonly configService: ConfigService,
  ) {}

  public async execute(id: Types.ObjectId): Promise<IProfile> {
    try {
      console.log('id', id);
      const profile = await this.profileService.deleteProfile(
        new Types.ObjectId(id),
      );

      if (!profile) {
        throw new HttpException('ไม่พบโปรไฟล์', 404);
      }

      const user = await this.userService.deleteUser(
        new Types.ObjectId(profile._userId),
      );

      if (!user) {
        throw new HttpException('ไม่พบผู้ใช้งาน', 404);
      }

      return profile;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
