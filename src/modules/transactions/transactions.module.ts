import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { Transaction, TransactionSchema } from './transactions.schema';
import { ProfileModule } from '../profile/profile.module';
import { GetTransactionsPaginationUsecase } from './usecase/getPagination.usecase';

const usecases = [GetTransactionsPaginationUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    ProfileModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ...usecases],
})
export class TransactionModule {}
