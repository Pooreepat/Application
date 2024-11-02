import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { SwipeService } from '../swipes.service';
import GetSwipePaginationDto from '../dtos/getPagination.dto';
import { ISwipe } from '../swipes.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { PetService } from 'src/modules/pet/pet.service';

@Injectable()
export class GetPaginationSwipeUsecase {
  constructor(
    readonly swipeService: SwipeService,
    readonly petService: PetService,
  ) {}

  public async execute(
    data: GetSwipePaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<ISwipe>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const filter = {
        isLiked: true,
        isActioned: false,
      };

      switch (user.role[0]) {
        case EUserRole.USER:
          filter['_adopterId'] = user._id;
          break;
        case EUserRole.AGENCY:
          const pets = await this.petService.findPetByCaretakerId(user._id);
          if (!pets) {
            throw new HttpException('Cannot get pet', 500);
          }
          filter['_petId'] = { $in: pets.map((pet) => pet._id) };
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const [swipes, total] = await this.swipeService.getPagination(
        filter,
        page,
        perPage,
      );

      if (!swipes) {
        throw new HttpException('Cannot get swipes', 500);
      }

      return {
        data: swipes,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
