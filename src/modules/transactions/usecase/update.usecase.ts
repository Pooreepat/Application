import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from '../transactions.service';
import { UpdateTransactionDto } from '../dto/transactions-update.dto';
import { Types } from 'mongoose';

@Injectable()
export class UpdateTransactionUsecase {
  constructor(
    private readonly transactionService: TransactionService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    id: Types.ObjectId,
    data: UpdateTransactionDto,
  ): Promise<any> {
    try {
      const transaction = await this.transactionService.update(
        new Types.ObjectId(id),
        data,
      );

      if (!transaction) {
        throw new HttpException('Transaction not found', 404);
      }

      return transaction;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
