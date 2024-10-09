import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './messages.schema';
import { MessageService } from './messages.service';
import { ProfileModule } from '../profile/profile.module';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ProfileModule,
    AuthModule
  ],
  providers: [MessageService, MessagesGateway],
})
export class MessageModule {}
