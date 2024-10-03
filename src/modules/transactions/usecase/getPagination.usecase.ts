import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import GetProfilePaginationDto from '../dto/getPagination.dto';
import { IProfile } from 'src/modules/profile/profile.interface';
import { TransactionService } from '../transactions.service';

@Injectable()
export class GetTransactionsPaginationUsecase {
  constructor(
    private readonly transactionService: TransactionService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: GetProfilePaginationDto,
    profile: IProfile,
  ): Promise<HttpResponsePagination> {
    try {
      const page = Number(data.page) || 1;
      const perPage = Number(data.perPage) || 10;

      const skip = (page - 1) * perPage;
      const [transactions, total] = await this.transactionService.getPagination(
        {},
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
