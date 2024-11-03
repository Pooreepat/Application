import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './messages.schema';
import { MessageService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../auth/auth.module';
import { MessageController } from './messages.controller';
import { GetMessagePaginationUsecase } from './usecase/getPagination.usecase';
import { MatchModule } from '../matches/matches.module';
import { UserModule } from '../user/user.module';

const usecases = [GetMessagePaginationUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule,
    MatchModule,
    UserModule
  ],
  controllers: [MessageController],
  providers: [MessageService, MessagesGateway, ...usecases],
})
export class MessageModule {}
