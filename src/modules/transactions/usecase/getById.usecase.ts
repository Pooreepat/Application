import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { TransactionService } from '../transactions.service';
import { ITransaction } from '../transactions.interface';

@Injectable()
export class GetByIdTransactionsUsecase {
  constructor(
    private readonly transactionService: TransactionService,
    readonly configService: ConfigService,
  ) {}

  public async execute(id: Types.ObjectId): Promise<ITransaction> {
    try {
      const transaction = await this.transactionService.getTransactionById(
        new Types.ObjectId(id),
      );

      if (!transaction) {
        throw new HttpException('ไม่พบธุรกรรม', 404);
      }

      return transaction;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
