import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import GetProfilePaginationDto from '../dto/getPagination.dto';
import { IProfile } from 'src/modules/profile/profile.interface';
import { TransactionService } from '../transactions.service';
import { IUser } from 'src/modules/user/user.interface';
import { EUserRole } from 'src/modules/user/user.constant';

@Injectable()
export class GetTransactionsPaginationUsecase {
  constructor(
    private readonly transactionService: TransactionService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: GetProfilePaginationDto,
    user: IUser & { profile: IProfile },
  ): Promise<HttpResponsePagination> {
    try {
      const page = Number(data.page) || 1;
      const perPage = Number(data.perPage) || 10;

      const query: any = {};

      if (!user.role.includes(EUserRole.ADMIN)) {
        query.$or = [
          { _profile1Id: user.profile._id },
          { _profile2Id: user.profile._id },
        ];
      }

      const skip = (page - 1) * perPage;
      const [transactions, total] = await this.transactionService.getPagination(
        query,
        skip,
        perPage,
      );
      if (!transactions) {
        throw new HttpException('ไม่พบข้อมูล', 404);
      }
      return {
        data: transactions,
        total,
        page,
        perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
