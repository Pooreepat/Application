import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { SwipeService } from '../swipes.service';
import { SwipeCreateDto } from '../dto/swipes-create.dto';

@Injectable()
export class CreateSwipesUsecase {
  constructor(
    private readonly swipeService: SwipeService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: SwipeCreateDto & { _swiperId: Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const swipe = await this.swipeService.create(data);

      if (!swipe) {
        throw new HttpException('ไม่สามารถปั้นสัตว์เลี้ยงได้', 500);
      }

      return {
        message: 'สร้างสัตว์เลี้ยงสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
