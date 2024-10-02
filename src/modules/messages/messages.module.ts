import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './messages.schema';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { CreateMessageUsecase } from './usecase/create.usecase';
import { ProfileModule } from '../profile/profile.module';
import { GetMessagePaginationUsecase } from './usecase/getPagination.usecase';

const usecases = [CreateMessageUsecase, GetMessagePaginationUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ProfileModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, ...usecases],
})
export class MessageModule {}
