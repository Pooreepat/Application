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
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

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
    private readonly profileService: ProfileService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    console.log('WebSocket initialized.');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const profile = await this.verifyUser(socket);
      if (profile) {
        socket.data.profile = profile;
        this.activeUsers.set(profile._id.toString(), socket.id);
        socket.emit('activeUsers', Array.from(this.activeUsers.keys()));

        this.wss.emit('userStatus', {
          id: profile._id.toString(),
          status: 'online',
        });
      }
    } catch (error) {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const id = this.findUserBySocketId(socket.id);
    if (id) {
      await this.profileService.updateProfile(
        new Types.ObjectId(socket.data.profile._id),
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
    @MessageBody('matchId') matchId: string,
  ) {
    if (!matchId) return;
    socket.join(matchId);
    socket.data.matchId = matchId;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() messageDto: MessageCreateDto,
  ) {
    const matchId = socket.data.matchId;
    if (!matchId) return;

    try {
      const message = await this.messageService.create({
        ...messageDto,
        _matchId: new Types.ObjectId(matchId),
        type: messageDto.type,
        _senderId: new Types.ObjectId(socket.data.profile._id),
      });
      this.wss.to(matchId).emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private findUserBySocketId(socketId: string): string | undefined {
    return Array.from(this.activeUsers.entries()).find(
      ([, id]) => id === socketId,
    )?.[0];
  }

  private async verifyUser(socket: Socket) {
    try {
      const token = socket.handshake.headers.authorization;
      if (!token) throw new UnauthorizedException();

      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('authentication.secret'),
      });

      const { _id } = decoded;
      return await this.profileService.getProfileByUserId(
        new Types.ObjectId(_id),
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
