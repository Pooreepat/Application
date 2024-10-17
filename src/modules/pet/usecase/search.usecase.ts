import { HttpException, Injectable } from '@nestjs/common';
import { PetService } from '../pet.service';
import { Types } from 'mongoose';
import { HttpRespons } from 'src/interface/respones';
import { SwipeService } from 'src/modules/swipes/swipes.service';
import PetSearchDto from '../dto/pet-search.dto';
import { IUser } from 'src/modules/user/user.interface';
import { IProfile } from 'src/modules/profile/profile.interface';
import { calculateSimilarity } from 'src/common/utils/calculateSimilarity';

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
      const { latitude, longitude, maxDistance, preferences, profile, search } =
        data;
      const swipedPets = await this.swipeService.getSwipedPetsByUser(
        profile._id,
      );
      const swipedPetIds = swipedPets.map((swipe) => swipe._swipedPetId);
      const queryData = {};
      if (search) {
        queryData['nickname'] = { $regex: search, $options: 'i' };
      }
      const nearbyPets = await this.petService.searchPets({
        queryData,
        location: {
          latitude: Number(latitude) || undefined,
          longitude: Number(longitude) || undefined,
        },
        maxDistance: Number(maxDistance) || undefined,
        excludePetIds: swipedPetIds,
      });
      
      const petScores = nearbyPets.map((pet) => {
        let maxScore = 0;

        if (preferences) {
          preferences.forEach((preference) => {
            const score = calculateSimilarity(pet, preference);
            if (score > maxScore) {
              maxScore = score;
            }
          });
        }

        return { ...pet, similarityScore: maxScore };
      });

      const sortedPets = petScores.sort(
        (a, b) => b.similarityScore - a.similarityScore,
      );
      return sortedPets;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
