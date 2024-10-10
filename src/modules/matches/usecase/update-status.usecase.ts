import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { MatchService } from '../matches.service';
import { MatchStatus } from '../matches.constant';
import { MatchUpdateStatusDto } from '../dto/matches-update-status.dto';

@Injectable()
export class UpdateStatusMatchUsecase {
  constructor(
    private readonly matchesService: MatchService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: MatchUpdateStatusDto & { id: Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const { id, swipeType } = data;
      if (data.swipeType === MatchStatus.UNMATCHED) {
        await this.matchesService.delete(new Types.ObjectId(id));
        return {
          message: 'ปฏิเสธแมตช์สำเร็จ',
        };
      } else {
        const match = await this.matchesService.update(new Types.ObjectId(id), {
          status: swipeType,
        });

        if (!match) {
          throw new HttpException('ไม่สามารถยอมรับแมตช์ได้', 500);
        }
      }

      return {
        message: 'ยอมรับแมตช์สำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
