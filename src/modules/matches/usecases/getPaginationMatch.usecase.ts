import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { MatchService } from '../matches.service';
import { IMatch } from '../matches.interface';
import GetMatchPaginationDto from '../dtos/getPaginationMatch.dto';
import { Types } from 'mongoose';

@Injectable()
export class GetPaginationMatchUsecase {
  constructor(private readonly matchService: MatchService) {}

  public async execute(
    data: GetMatchPaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<IMatch>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const filter = {
        $or: [
          { _adopterId: new Types.ObjectId(user._id) },
          { _caretakerId: new Types.ObjectId(user._id) },
        ],
      };

      if (data._petId) {
        filter['_petId'] = new Types.ObjectId(data._petId);
      }

      const [matches, total] = await this.matchService.getPagination(
        filter,
        page,
        perPage,
      );

      if (!matches) {
        throw new HttpException('Cannot get user', 500);
      }

      return {
        data: matches,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
