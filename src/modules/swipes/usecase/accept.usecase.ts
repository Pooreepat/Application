import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { SwipeService } from '../swipes.service';
import { SwipeCreateDto } from '../dto/swipes-create.dto';
import { IProfile } from 'src/modules/profile/profile.interface';

@Injectable()
export class AcceptSwipesUsecase {
  constructor(
    private readonly swipeService: SwipeService,
    readonly configService: ConfigService,
  ) {}

  public async execute(data: {
    _swipedPetId: string;
    profile: IProfile;
  }): Promise<HttpRespons> {
    try {
      const swipe = await this.swipeService.update(
        data._swipedPetId,
        {
          _swiperId: data.profile._id,
        },
      );


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
