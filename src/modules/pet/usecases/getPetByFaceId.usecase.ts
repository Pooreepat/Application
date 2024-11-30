import { HttpException, Injectable } from '@nestjs/common';
import { PetService } from '../pet.service';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPet } from '../pet.interface';

@Injectable()
export class GetPetByFaceIdUsecase {
  constructor(private readonly petService: PetService) {}

  public async execute(id: string, user: IUser): Promise<IPet> {
    try {
      const pet = await this.petService.getPetByFaceId(Number(id));

      if (!pet) {
        throw new HttpException('ไม่พบสัตว์เลี้ยง', 404);
      }

      return pet;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
