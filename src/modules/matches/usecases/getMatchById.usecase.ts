import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { MatchService } from '../matches.service';
import { IMatch } from '../matches.interface';

@Injectable()
export class GetMatchByIdUsecase {
  constructor(private readonly matchService: MatchService) {}

  public async execute(id: string, user: IUser): Promise<IMatch> {
    try {
      const match = await this.matchService.findMatchById(
        new Types.ObjectId(id),
      );

      if (!match) {
        throw new HttpException('ไม่พบการจับคู่', 404);
      }

      if (
        !user._id.equals(match._adopterId) &&
        !user._id.equals(match._caretakerId)
      ) {
        throw new HttpException('ไม่มีสิทธิ์ในการดูข้อมูล', 403);
      }

      return match;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
