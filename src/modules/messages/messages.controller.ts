import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { GetMessagePaginationUsecase } from './usecase/getPagination.usecase';
import GetMessagePaginationDto from './dto/getPaginationMessage.dto';
import { IUser } from '../user/interfaces/user.interface';
import { HttpResponsePagination } from 'src/interface/respones';
import { IMessage } from './messages.interface';

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
    @User() user: IUser,
    @Query() query: GetMessagePaginationDto,
  ): Promise<HttpResponsePagination<IMessage>> {
    return this.getMessagePaginationUsecase.execute(query, user);
  }
}
