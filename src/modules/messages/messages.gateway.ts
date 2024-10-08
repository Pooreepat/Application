import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../messages/messages.service';
import { MessageCreateDto } from './dto/message-create.dto';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';

@WebSocketGateway({
  namespace: '/messages',
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private activeUsers = new Map<string, string>();

  constructor(private readonly messageService: MessageService) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized.');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = socket.handshake.auth.userId;
    //   console.log(socket)
    console.log(socket.data.user);
    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
    this.activeUsers.set(userId, socket.id);

    socket.emit('activeUsers', Array.from(this.activeUsers.keys()));
    this.wss.emit('userStatus', { userId, status: 'online' });
  }


  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`Socket disconnected: ${socket.id}`);

    const userId = this.findUserBySocketId(socket.id);
    if (userId) {
      this.activeUsers.delete(userId);
      this.wss.emit('userStatus', { userId, status: 'offline' });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('matchId') matchId: string,
  ) {
    socket.join(matchId);
    socket.data.matchId = matchId;

    const [messages, total] = await this.messageService.getPagination(
      { _matcheId: matchId },
      1,
      30,
    );

    socket.emit('chatHistory', {
      messages,
      total,
      page: 1,
      perPage: 30,
    });
  }

  @SubscribeMessage('loadMoreMessages')
  async handleLoadMoreMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { page, perPage }: { page: number; perPage: number },
  ) {
    const matchId = socket.data.matchId;
    const [messages, total] = await this.messageService.getPagination(
      { _matcheId: matchId },
      page,
      perPage,
    );

    socket.emit('messageHistory', { messages, total, page, perPage });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @MessageBody() messageDto: MessageCreateDto,
  ) {
    const matchId = socket.data.matchId;
    const message = await this.messageService.create({
      ...messageDto,
      _matcheId: matchId,
      type: messageDto.type,
      _senderId: user.profile._id,
    });

    this.wss.to(matchId).emit('newMessage', message);
  }

  private findUserBySocketId(socketId: string): string | undefined {
    return Array.from(this.activeUsers.entries()).find(
      ([_, id]) => id === socketId,
    )?.[0];
  }
}
