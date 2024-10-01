import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { MessageService } from './messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageCreateDto } from './dto/message-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createMessageDto: MessageCreateDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: MessageCreateDto,
  ) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messageService.delete(id);
  }
}
