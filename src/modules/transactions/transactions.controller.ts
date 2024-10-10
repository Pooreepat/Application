import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetTransactionsPaginationDto from './dto/getPagination.dto';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { GetTransactionsPaginationUsecase } from './usecase/getPagination.usecase';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly getTransactionsPaginationUsecase: GetTransactionsPaginationUsecase,
  ) {}

  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetTransactionsPaginationDto,
  ): Promise<any> {
    return this.getTransactionsPaginationUsecase.execute(query, user.profile);
  }
}
