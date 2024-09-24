import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { ProfileService } from '../profile.service';
import UpdateProfileDto from '../dto/update.dto';
import { Types } from 'mongoose';

@Injectable()
export class UpdateProfileUsecase {
  constructor(
    private readonly profileService: ProfileService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: UpdateProfileDto & { id: string | Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const profile = await this.profileService.updateProfile(data.id, data);

      if (!profile) {
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
