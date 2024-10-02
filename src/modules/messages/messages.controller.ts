import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MessageService } from './messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageCreateDto } from './dto/message-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMessageUsecase } from './usecase/create.usecase';
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
    private readonly messageService: MessageService,
    private readonly getMessagePaginationUsecase: GetMessagePaginationUsecase,
    private readonly createMessageUsecase: CreateMessageUsecase,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() createMessageDto: MessageCreateDto,
  ) {
    return this.createMessageUsecase.execute({
      ...createMessageDto,
      profile: user.profile,
    });
  }

  // @Get()
  // findAll() {
  //   return this.messageService.findAll();
  // }

  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetMessagePaginationDto,
  ): Promise<any> {
    return this.getMessagePaginationUsecase.execute(query, user.profile);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messageService.findOne(id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: MessageCreateDto) {
  //   return this.messageService.update(id, updateMessageDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.messageService.delete(id);
  // }
}
