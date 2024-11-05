import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { SwipeService } from '../swipes.service';
import GetSwipePaginationDto from '../dtos/getPagination.dto';
import { ISwipe } from '../swipes.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { PetService } from 'src/modules/pet/pet.service';
import { Types } from 'mongoose';

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
          if (data._petId) {
            filter['_petId'] = new Types.ObjectId(data._petId);
          }
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const [swipes, total] = await this.swipeService.getPagination(
        filter,
        page,
        perPage,
      );

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
