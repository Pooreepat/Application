import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose'; // Ensure Types is imported
import { SwipeService } from '../swipes.service';
import { SwipeCreateDto } from '../dto/swipes-create.dto';
import { MatchService } from 'src/modules/matches/matches.service';
import { MatchStatus } from 'src/modules/matches/matches.constant';
import { SwipeType } from '../swipes.constant';

@Injectable()
export class CreateSwipesUsecase {
  constructor(
    private readonly swipeService: SwipeService,
    private readonly matchesService: MatchService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: SwipeCreateDto & { _swiperId: Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const _swipedPetId = new Types.ObjectId(data._swipedPetId);
      const _swipedId = new Types.ObjectId(data._swipedId);

      const checkSwipe = await this.swipeService.findByFilter({
        _swiperId: data._swiperId,
        _swipedPetId: _swipedPetId,
        _swipedId: _swipedId,
      });

      if (checkSwipe) {
        throw new HttpException('สัตว์เลี้ยงนี้ถูกปั้นแล้ว', 500);
      }

      const swipe = await this.swipeService.create({
        ...data,
        _swipedPetId: _swipedPetId,
        _swipedId: _swipedId,
      });

      if (!swipe) {
        throw new HttpException('ไม่สามารถปั้นสัตว์เลี้ยงได้', 500);
      }

      if (swipe.swipeType == SwipeType.LIKE) {
        const match = await this.matchesService.create({
          _profile1Id: swipe._swiperId,
          _profile2Id: _swipedId,
          _petId: _swipedPetId,
          status: MatchStatus.UNMATCHED,
        });

        if (!match) {
          throw new HttpException('ไม่สามารถสร้างแมตช์ได้', 500);
        }
      }

      return {
        message: 'ปั้นสัตว์เลี้ยงสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
