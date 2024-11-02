import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PetService } from '../pet.service';
import { IPet } from '../pet.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { SwipeService } from 'src/modules/swipes/swipes.service';
import SearchPetDto from '../dtos/searchPets.dto';
import { calculateSimilarity } from 'src/common/utils/calculateSimilarity';

@Injectable()
export class SearchPetsUsecase {
  constructor(
    private readonly petService: PetService,
    private readonly swipeService: SwipeService,
  ) {}

  public async execute(data: SearchPetDto, user: IUser): Promise<IPet[]> {
    try {
      const swipedPets = await this.swipeService.getSwipedByAdopterId(user._id);
      const swipedPetIds = swipedPets.map((swipe) => swipe._petId);

      const filter = {};

      if (data.search) {
        filter['nickname'] = { $regex: data.search, $options: 'i' };
      }

      const nearbyPets = await this.petService.searchPets({
        queryData: filter,
        location: {
          latitude: Number(data.latitude) || undefined,
          longitude: Number(data.longitude) || undefined,
        },
        maxDistance: user.profile.distance || 100,
        excludePetIds: swipedPetIds,
      });

      const petScores = nearbyPets.map((pet) => {
        let maxScore = 0;

        if (user.profile.preferences.length > 0) {
          const score = calculateSimilarity(pet, user.profile.preferences);
          if (score > maxScore) {
            maxScore = score;
          }
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
