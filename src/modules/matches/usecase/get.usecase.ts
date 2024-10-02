import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { MatchService } from '../matches.service';
import { MatchStatus } from '../matches.constant';

@Injectable()
export class AcceptMatchesUsecase {
  constructor(
    private readonly matchesService: MatchService,
    readonly configService: ConfigService,
  ) {}

  public async execute(data: { id: Types.ObjectId }): Promise<HttpRespons> {
    try {
      const match = await this.matchesService.update(data.id as any, {
        status: MatchStatus.ACCEPTED,
      });

      if (!match) {
        throw new HttpException('ไม่สามารถยอมรับแมตช์ได้', 500);
      }

      return {
        message: 'ยอมรับแมตช์สำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
