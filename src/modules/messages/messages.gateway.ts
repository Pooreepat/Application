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
import { CreateMessageDto } from './dto/createMessage.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { MatchService } from '../matches/matches.service';
import { IMatch } from '../matches/matches.interface';
import { IUser } from '../user/interfaces/user.interface';

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

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly matchService: MatchService,
  ) {}

  afterInit() {
    console.log('WebSocket initialized.');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const user = await this.verifyUser(socket);
      if (!user) {
        throw new UnauthorizedException();
      }
      socket.data.user = user;
      this.activeUsers.set(user._id.toString(), socket.id);
      socket.emit('activeUsers', Array.from(this.activeUsers.keys()));

      this.wss.emit('userStatus', {
        id: user._id.toString(),
        status: 'online',
      });
    } catch (error) {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const id = this.findUserBySocketId(socket.id);
    if (id) {
      await this.userService.updateUser(
        new Types.ObjectId(socket.data.user._id),
        {
          lastLogin: new Date(),
        },
      );

      this.activeUsers.delete(id);
      this.wss.emit('userStatus', { id, status: 'offline' });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    const { matchId } = data;
    if (!matchId) return;
    const match = await this.matchService.findMatchById(
      new Types.ObjectId(matchId),
    );
    if (!match) return;
    socket.join(match._id.toString());
    socket.data.match = match;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() messageDto: CreateMessageDto,
  ) {
    const match: IMatch = socket.data.match;
    const user: IUser = socket.data.user;
    if (!match) return;
    if (!user) return;

    try {
      const message = await this.messageService.create({
        ...messageDto,
        _matchId: new Types.ObjectId(match._id),
        _senderId: new Types.ObjectId(user._id),
      });
      this.wss.to(match._id.toString()).emit('newMessage', message);

      const recipientId = this.findSocketByUserId(
        user._id.equals(match._caretakerId)
          ? match._adopterId.toString()
          : match._caretakerId.toString(),
      );
      if (recipientId) {
        this.wss.to(recipientId).emit('newMessageNotification', {
          ...message,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private findUserBySocketId(socketId: string): string | undefined {
    return Array.from(this.activeUsers.entries()).find(
      ([, id]) => id === socketId,
    )?.[0];
  }

  private findSocketByUserId(userId: string): string | undefined {
    return this.activeUsers.get(userId);
  }

  private async verifyUser(socket: Socket) {
    try {
      const token = socket.handshake.headers.authorization;
      if (!token) throw new UnauthorizedException();

      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('authentication.secret'),
      });

      const { _id } = decoded;
      return await this.userService.getUserById(new Types.ObjectId(_id));
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
