import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import GetTransactionsPaginationDto from '../dto/getPaginationTransactions.dto';
import { TransactionService } from '../transactions.service';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { ITransaction } from '../transactions.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { Types } from 'mongoose';

@Injectable()
export class GetPaginationTransactionsUsecase {
  constructor(private readonly transactionService: TransactionService) {}

  public async execute(
    data: GetTransactionsPaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<ITransaction>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const filter = {};

      if (data._petId) {
        filter['_petId'] = new Types.ObjectId(data._petId);
      }

      switch (user.role[0]) {
        case EUserRole.ADMIN:
          break;
        case EUserRole.AGENCY:
          filter['$or'] = [
            { _adopterId: new Types.ObjectId(user._id) },
            { _caretakerId: new Types.ObjectId(user._id) },
          ];
          break;
        case EUserRole.USER:
          filter['$or'] = [
            { _adopterId: new Types.ObjectId(user._id) },
            { _caretakerId: new Types.ObjectId(user._id) },
          ];
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const [transactions, total] = await this.transactionService.getPagination(
        filter,
        page,
        perPage,
      );

      if (!transactions) {
        throw new HttpException('Cannot get transactions', 500);
      }

      return {
        data: transactions,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
