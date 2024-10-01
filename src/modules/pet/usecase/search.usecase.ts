import { HttpException, Injectable } from '@nestjs/common';
import { PetService } from '../pet.service';
import { Types } from 'mongoose';
import { HttpRespons } from 'src/interface/respones';
import { SwipeService } from 'src/modules/swipes/swipes.service';
import PetSearchDto from '../dto/pet-search.dto';
import { IUser } from 'src/modules/user/user.interface';
import { IProfile } from 'src/modules/profile/profile.interface';

@Injectable()
export class SearchPetUsecase {
  constructor(
    private readonly petService: PetService,
    private readonly swipeService: SwipeService,
  ) {}

  public async execute(
    data: PetSearchDto & { profile: IProfile },
  ): Promise<any> {
    try {
      const {
        latitude,
        longitude,
        maxDistance,
        gender,
        specie,
        minAge,
        maxAge,
        profile,
      } = data;

      const swipedPets = await this.swipeService.getSwipedPetsByUser(
        profile._id,
      );
      const swipedPetIds = swipedPets.map((swipe) => swipe._swipedPetId);

      const nearbyPets = await this.petService.searchPets({
        location: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        maxDistance: Number(maxDistance),
        preferences: {
          gender: gender,
          species: specie,
          ageRange: {
            min: Number(minAge),
            max: Number(maxAge),
          },
        },
        excludePetIds: swipedPetIds,
      });

      return nearbyPets;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
