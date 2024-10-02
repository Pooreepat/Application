import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { SwipeService } from '../swipes.service';
import { SwipeCreateDto } from '../dto/swipes-create.dto';
import { MatchService } from 'src/modules/matches/matches.service';
import { MatchStatus } from 'src/modules/matches/matches.constant';

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
      const checkSwipe = await this.swipeService.findByFilter({
        _swiperId: data._swiperId,
        _swipedPetId: data._swipedPetId,
        _swipedId: data._swipedId,
      });

      if (checkSwipe) {
        throw new HttpException('สัตว์เลี้ยงนี้ถูกปั้นแล้ว', 500);
      }

      const swipe = await this.swipeService.create(data);

      if (!swipe) {
        throw new HttpException('ไม่สามารถปั้นสัตว์เลี้ยงได้', 500);
      }

      const match = await this.matchesService.create({
        _profile1Id: swipe._swiperId as any,
        _profile2Id: swipe._swipedId as any,
        _petId: swipe._swipedPetId as any,
        status: MatchStatus.UNMATCHED,
      });

      if (!match) {
        throw new HttpException('ไม่สามารถสร้างแมตช์ได้', 500);
      }

      return {
        message: 'ปั้นสัตว์เลี้ยงสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
