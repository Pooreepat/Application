import { HttpException, Injectable } from '@nestjs/common';
import { PetService } from '../pet.service';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPet } from '../pet.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { EPetStatus } from '../pet.constant';
import { Types } from 'mongoose';
import { UpdatePetDto } from '../dtos/updatePet.dto';

@Injectable()
export class UpdatePetUsecase {
  constructor(private readonly petService: PetService) {}

  public async execute(
    data: UpdatePetDto,
    id: string,
    user: IUser,
  ): Promise<IPet> {
    try {
      const pet = await this.petService.getPetById(new Types.ObjectId(id));

      if (!pet) {
        throw new HttpException('Pet not found', 404);
      }

      switch (user.role[0]) {
        case EUserRole.AGENCY:
          if (
            !new Types.ObjectId(pet._caretakerId).equals(user._id) ||
            pet.status === EPetStatus.COMPLETED
          ) {
            throw new HttpException('You do not have permission', 403);
          }
          break;
        case EUserRole.USER:
          if (!new Types.ObjectId(pet._adopterId).equals(user._id)) {
            throw new HttpException('You do not have permission', 403);
          }
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const petUpdate = await this.petService.updatePet(
        new Types.ObjectId(id),
        {
          nickname: data.nickname,
          location: data.location,
          tags: data.tags,
          images: data.images,
          generalHealth: data.generalHealth,
          vaccinationHistory: data.vaccinationHistory,
          theme: data.theme,
          isAlive: !pet.isAlive && data.isAlive,
          notes: data.notes,
          isHiddened: pet.status === EPetStatus.UNADOPTED && data.isHiddened,
          isSpayedOrNeutered:
            !pet.isSpayedOrNeutered && data.isSpayedOrNeutered,
        },
      );

      if (!petUpdate) {
        throw new HttpException('Cannot update pet', 500);
      }

      return petUpdate;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
