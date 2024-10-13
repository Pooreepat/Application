import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons, HttpResponsePagination } from 'src/interface/respones';
import GetProfilePaginationDto from '../dto/pet-getPagination.dto';
import UpdateProfileDto from '../dto/pet-update.dto';
import { Types } from 'mongoose';
import { PetService } from '../pet.service';
import { IUser } from 'src/modules/user/user.interface';
import { IProfile } from 'src/modules/profile/profile.interface';

@Injectable()
export class UpdatePetUsecase {
  constructor(
    private readonly petService: PetService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: UpdateProfileDto & { id: string | Types.ObjectId },
    user: IUser & { profile: IProfile },
  ): Promise<HttpRespons> {
    try {
      const profile = await this.petService.updatePet(
        new Types.ObjectId(data.id),
        {
          ...data,
          _profileId: new Types.ObjectId(user.profile._id),
        },
      );

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
