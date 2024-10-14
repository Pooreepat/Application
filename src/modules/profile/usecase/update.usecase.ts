import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { ProfileService } from '../profile.service';
import UpdateProfileDto from '../dto/update.dto';
import { Types } from 'mongoose';
import { UserService } from '../../user/user.service';

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: UpdateProfileDto & { id: string | Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const profile = await this.profileService.updateProfile(
        new Types.ObjectId(data.id),
        {
          phone: data.phone,
          images: data.images,
          firstname: data.firstname,
          lastname: data.lastname,
          birthdayAt: data.birthdayAt,
          accommodationType: data.accommodationType,
          level: data.level,
          distance: data.distance,
          freeTime: data.freeTime,
          personality: data.personality,
          lifestyle: data.lifestyle,
        },
      );

      if (!profile) {
        throw new HttpException('ไม่สามารถอัพเดทโปรไฟล์ได้', 500);
      }

      const user = await this.userService.updateUser(
        new Types.ObjectId(profile._userId),
        {
          email: data.email,
        },
      );

      if (!user) {
        throw new HttpException('ไม่สามารถอัพเดทโปรไฟล์ได้', 500);
      }

      return {
        message: 'อัพเดทโปรไฟล์สำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
