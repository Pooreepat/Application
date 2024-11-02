import { HttpException, Injectable } from '@nestjs/common';
import { SwipeService } from '../swipes.service';
import { CreateSwipesDto } from '../dtos/createSwipes.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { ISwipe } from '../swipes.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { Types } from 'mongoose';

@Injectable()
export class CreateSwipesUsecase {
  constructor(readonly swipeService: SwipeService) {}

  public async execute(data: CreateSwipesDto, user: IUser): Promise<ISwipe> {
    try {
      switch (user.role[0]) {
        case EUserRole.USER:
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const swipe = await this.swipeService.getSwipeByPetIdAndAdopterId(
        new Types.ObjectId(data._petId),
        user._id,
      );

      if (swipe) {
        throw new HttpException('You have already swiped', 403);
      }

      const swipeCreate = await this.swipeService.createSwipe({
        _adopterId: user._id,
        _petId: new Types.ObjectId(data._petId),
        isLiked: data.isLiked,
        isActioned: data.isLiked ? false : true,
      });

      if (!swipeCreate) {
        throw new HttpException('Cannot create swipe', 500);
      }

      return swipeCreate;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
