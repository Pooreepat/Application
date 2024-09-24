import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons, HttpResponsePagination } from 'src/interface/respones';
import GetProfilePaginationDto from '../dto/getPagination.dto';
import UpdateProfileDto from '../dto/update.dto';
import { Types } from 'mongoose';
import { PetService } from '../pet.service';

@Injectable()
export class UpdatePetUsecase {
  constructor(
    private readonly petService: PetService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: UpdateProfileDto & { id: string | Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const profile = await this.petService.updatePet(data.id, data);

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
