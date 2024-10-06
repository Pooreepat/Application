import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose'; // Ensure Types is imported
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
      // Ensure _swipedPetId and _swipedId are converted to ObjectId
      const _swipedPetId = new Types.ObjectId(data._swipedPetId);
      const _swipedId = new Types.ObjectId(data._swipedId);

      // Check if the swipe already exists
      const checkSwipe = await this.swipeService.findByFilter({
        _swiperId: data._swiperId,
        _swipedPetId: _swipedPetId, // Use ObjectId
        _swipedId: _swipedId, // Use ObjectId
      });

      if (checkSwipe) {
        throw new HttpException('สัตว์เลี้ยงนี้ถูกปั้นแล้ว', 500);
      }

      // Create a new swipe with ObjectId conversion
      const swipe = await this.swipeService.create({
        ...data,
        _swipedPetId: _swipedPetId, // Ensure ObjectId is used
        _swipedId: _swipedId, // Ensure ObjectId is used
      });

      if (!swipe) {
        throw new HttpException('ไม่สามารถปั้นสัตว์เลี้ยงได้', 500);
      }

      // Create a match entry after swipe
      const match = await this.matchesService.create({
        _profile1Id: swipe._swiperId,
        _profile2Id: _swipedId, // Use ObjectId
        _petId: _swipedPetId, // Use ObjectId
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
