import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetTransactionsPaginationDto from './dto/getPaginationTransactions.dto';
import { User } from '../user/user.decorator';
import { GetPaginationTransactionsUsecase } from './usecase/getPaginationTransactions.usecase';
import { Types } from 'mongoose';
import { GetTransactionByIdUsecase } from './usecase/getTransactionById.usecase';
import { ITransaction } from './transactions.interface';
import { UpdateTransactionDto } from './dto/transactions-update.dto';
import { IUser } from '../user/interfaces/user.interface';
import { HttpResponsePagination } from 'src/interface/respones';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly getPaginationTransactionsUsecase: GetPaginationTransactionsUsecase,
    private readonly getTransactionByIdUsecase: GetTransactionByIdUsecase,
  ) {}

  @Get()
  public async getPagination(
    @User() user: IUser,
    @Query() query: GetTransactionsPaginationDto,
  ): Promise<HttpResponsePagination<ITransaction>> {
    return this.getPaginationTransactionsUsecase.execute(query, user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the user' })
  public async getMatchById(
    @User() user: IUser,
    @Param('id') id: string,
  ): Promise<ITransaction> {
    return this.getTransactionByIdUsecase.execute(id, user);
  }
}
