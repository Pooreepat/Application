import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { Transaction, TransactionSchema } from './transactions.schema';
import { ProfileModule } from '../profile/profile.module';
import { GetTransactionsPaginationUsecase } from './usecase/getPagination.usecase';
import { TransactionGateway } from './transactions.gateway';
import { AuthModule } from '../auth/auth.module';
import { GetByIdTransactionsUsecase } from './usecase/getById.usecase';
import { MatchModule } from '../matches/matches.module';
import { PetModule } from '../pet/pet.module';
import { UpdateTransactionUsecase } from './usecase/update.usecase';

const usecases = [
  GetTransactionsPaginationUsecase,
  GetByIdTransactionsUsecase,
  UpdateTransactionUsecase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    ProfileModule,
    AuthModule,
    MatchModule,
    PetModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ...usecases, TransactionGateway],
})
export class TransactionModule {}
