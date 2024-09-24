import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { PetService } from '../pet.service';
import CreatePetDto from '../dto/create.dto';

@Injectable()
export class CreatePetUsecase {
  constructor(
    private readonly petService: PetService,
    readonly configService: ConfigService,
  ) {}

  public async execute(data: CreatePetDto): Promise<HttpRespons> {
    try {
      const pet = await this.petService.createPet(data);

      if (!pet) {
        throw new HttpException('ไม่สามารถสร้างผู้ใช้งานได้', 500);
      }

      return {
        message: 'สร้างสัตว์เลี้ยงสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
