import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { Transaction, TransactionSchema } from './transactions.schema';
// import { TransactionGateway } from './transactions.gateway';
import { AuthModule } from '../auth/auth.module';
import { GetPaginationTransactionsUsecase } from './usecase/getPaginationTransactions.usecase';
import { GetTransactionByIdUsecase } from './usecase/getTransactionById.usecase';
import { PetModule } from '../pet/pet.module';
import { MatchModule } from '../matches/matches.module';
import { TransactionGateway } from './transactions.gateway';
import { UserModule } from '../user/user.module';

const usecases = [GetPaginationTransactionsUsecase, GetTransactionByIdUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    AuthModule,
    PetModule,
    MatchModule,
    UserModule
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    ...usecases,
    TransactionGateway
  ],
})
export class TransactionModule {}
