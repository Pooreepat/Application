import { HttpException, Injectable } from '@nestjs/common';
import { PetService } from '../pet.service';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPet } from '../pet.interface';
import { CreatePetDto } from '../dtos/createPet.dto';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { EPetStatus } from '../pet.constant';

@Injectable()
export class CreatePetUsecase {
  constructor(private readonly petService: PetService) {}

  public async execute(data: CreatePetDto, user: IUser): Promise<IPet> {
    try {
      switch (user.role[0]) {
        case EUserRole.AGENCY:
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const petCreate = await this.petService.createPet({
        _caretakerId: user._id,
        nickname: data.nickname,
        isMale: data.isMale,
        breed: data.breed,
        location: data.location,
        species: data.species,
        tags: data.tags,
        images: data.images,
        generalHealth: data.generalHealth,
        birthdayAt: new Date(data.birthdayAt),
        vaccinationHistory: data.vaccinationHistory,
        theme: data.theme,
        isAlive: true,
        notes: data.notes,
        size: data.size,
        isHiddened: data.isHiddened,
        status: EPetStatus.UNADOPTED,
        isSpayedOrNeutered: data.isSpayedOrNeutered,
      });

      if (!petCreate) {
        throw new HttpException('Cannot create pet', 500);
      }

      return petCreate;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
