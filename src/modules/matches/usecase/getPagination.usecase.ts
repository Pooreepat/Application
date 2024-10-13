import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import { IProfile } from 'src/modules/profile/profile.interface';
import { MatchService } from '../matches.service';
import GetMatchesPaginationDto from '../dto/matches-getPagination.dto';
import { MatchStatus } from '../matches.constant';
import { Types } from 'mongoose';

@Injectable()
export class GetMatchesPaginationUsecase {
  constructor(
    private readonly matchesService: MatchService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: GetMatchesPaginationDto,
    profile: IProfile,
  ): Promise<HttpResponsePagination> {
    try {
      const status = data.status;
      const _petId = data._petId;
      const page = Number(data.page) || 1;
      const perPage = Number(data.perPage) || 10;

      const query: any = {
        $or: [{ _profile1Id: profile._id }, { _profile2Id: profile._id }],
      };

      if (status !== 'both') {
        query.status = status;
      }

      if (_petId) {
        query._petId = new Types.ObjectId(_petId);
      }
      const skip = (page - 1) * perPage;
      const [matches, total] = await this.matchesService.getPagination(
        query,
        skip,
        perPage,
        _petId ? true : false,
      );
      if (!matches) {
        throw new HttpException('ไม่พบข้อมูล', 404);
      }
      return {
        data: matches,
        total,
        page,
        perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
