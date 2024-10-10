import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { MatchService } from '../matches.service';
import { IMatch } from '../matches.interface';

@Injectable()
export class GetByIdMatchUsecase {
  constructor(
    private readonly matchService: MatchService,
    readonly configService: ConfigService,
  ) {}

  public async execute(id: Types.ObjectId): Promise<IMatch> {
    try {
      const match = await this.matchService.getMatchById(id);

      if (!match) {
        throw new HttpException('ไม่พบข้อมูล', 404);
      }

      return match;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
