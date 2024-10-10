import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { GetMessagePaginationUsecase } from './usecase/getPagination.usecase';
import GetMessagePaginationDto from './dto/message-getPagination.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(
    private readonly getMessagePaginationUsecase: GetMessagePaginationUsecase,
  ) {}

  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetMessagePaginationDto,
  ): Promise<any> {
    return this.getMessagePaginationUsecase.execute(query, user.profile);
  }
}
