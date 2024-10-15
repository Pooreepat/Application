import { Controller, Get, UseGuards, Query, Param, Body, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetTransactionsPaginationDto from './dto/getPagination.dto';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { GetTransactionsPaginationUsecase } from './usecase/getPagination.usecase';
import { Types } from 'mongoose';
import { GetByIdTransactionsUsecase } from './usecase/getById.usecase';
import { ITransaction } from './transactions.interface';
import { UpdateTransactionDto } from './dto/transactions-update.dto';
import { UpdateTransactionUsecase } from './usecase/update.usecase';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly getTransactionsPaginationUsecase: GetTransactionsPaginationUsecase,
    private readonly getByIdTransactionsUsecase: GetByIdTransactionsUsecase,
    private readonly updateTransactionUsecase: UpdateTransactionUsecase,
  ) {}

  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetTransactionsPaginationDto,
  ): Promise<any> {
    return this.getTransactionsPaginationUsecase.execute(query, user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the transaction' })
  public async getTransaction(
    @Param('id') id: Types.ObjectId,
    @User() user: IUser,
  ): Promise<ITransaction> {
    return this.getByIdTransactionsUsecase.execute(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the transaction' })
  public async updateTransaction(
    @Param('id') id: Types.ObjectId,
    @Body() data: UpdateTransactionDto,
  ): Promise<any> {
    return this.updateTransactionUsecase.execute(id, data);
  }

}
