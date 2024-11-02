import { HttpException, Injectable } from '@nestjs/common';
import { SwipeService } from '../swipes.service';
import { CreateSwipesDto } from '../dtos/createSwipes.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { ISwipe } from '../swipes.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { Types } from 'mongoose';
import { MatchService } from '../../matches/matches.service';

@Injectable()
export class ActionSwipesUsecase {
  constructor(
    readonly swipeService: SwipeService,
    readonly matchService: MatchService,
  ) {}

  public async execute(
    status: 'accepted' | 'rejected',
    id: string,
    user: IUser,
  ): Promise<ISwipe> {
    try {
      const swipe = await this.swipeService.getSwipeById(
        new Types.ObjectId(id),
      );

      if (!swipe) {
        throw new HttpException('Cannot get swipe', 500);
      }

      if (swipe.isActioned) {
        throw new HttpException('Swipe already actioned', 403);
      }

      switch (user.role[0]) {
        case EUserRole.AGENCY:
          if (!swipe) {
            throw new HttpException('Cannot get swipe', 500);
          }
          if (!new Types.ObjectId(swipe.pet._caretakerId).equals(user._id)) {
            throw new HttpException('You do not have permission', 403);
          }
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const updateSwipe = await this.swipeService.updateSwipe(
        new Types.ObjectId(id),
        {
          isActioned: true,
        },
      );

      if (!updateSwipe) {
        throw new HttpException('Cannot update swipe', 500);
      }
      if (status === 'accepted') {
        const match = await this.matchService.createMatch({
          _caretakerId: swipe.pet._caretakerId,
          _adopterId: updateSwipe._adopterId,
          _petId: swipe._petId,
          _swipeId: swipe._id,
          isTransaction: false,
        });

        if (!match) {
          throw new HttpException('Cannot create match', 500);
        }
      }

      return updateSwipe;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
