import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import GetProfilePaginationDto from '../dto/getPagination.dto';
import { ProfileService } from '../profile.service';
import { EUserRole } from 'src/modules/user/user.constant';

@Injectable()
export class GetProfilePaginationUsecase {
  constructor(
    private readonly profileService: ProfileService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: GetProfilePaginationDto,
  ): Promise<HttpResponsePagination> {
    try {
      const page = Number(data.page) || 1;
      const perPage = Number(data.perPage) || 10;
      const role = data.role;
      const skip = (page - 1) * perPage;
      const filterUserQuery = {};
      if (role) {
        filterUserQuery['user.role'] = { $in: [role] };
      }
      const [profiles, total] = await this.profileService.getPagination(
        {},
        filterUserQuery,
        skip,
        perPage,
      );
      if (!profiles) {
        throw new HttpException('ไม่พบข้อมูล', 404);
      }
      return {
        data: profiles,
        total,
        page,
        perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
