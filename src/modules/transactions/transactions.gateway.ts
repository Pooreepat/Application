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
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { TransactionService } from './transactions.service';
import { TransactionStatus } from './transactions.constant';
import { TransactionUpdateDto } from './dto/transactions-update.dto';

@WebSocketGateway({
  namespace: '/transactions',
  cors: {
    origin: '*',
  },
})
export class TransactionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private wss: Server;

  constructor(
    private readonly transactionService: TransactionService,
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
      socket.data.profile = profile;
    } catch (error) {
      console.warn('Client connection rejected:', error.message);
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('matchId') matchId: Types.ObjectId,
  ) {
    if (!matchId) return;
    socket.join(matchId.toString());
    socket.data.roomId = matchId.toString();
  }

  @SubscribeMessage('createTransaction')
  async handleCreateTransaction(@ConnectedSocket() socket: Socket) {
    if (!socket.data.roomId) {
      throw new BadRequestException('Room ID is required');
    }

    try {
      const transaction = await this.transactionService.create({
        _matchId: new Types.ObjectId(socket.data.roomId),
        status: TransactionStatus.PENDING,
      });
      socket.data.transactionId = transaction._id;
      this.wss
        .to(socket.data.roomId.toString())
        .emit('transactionCreated', transaction);
    } catch (error) {
      throw new Error('Transaction creation failed');
    }
  }

  @SubscribeMessage('updateTransactionStatus')
  async handleUpdateTransactionStatus(
    @MessageBody() data: TransactionUpdateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { status } = data;
    const roomId = socket.data.roomId;

    if (!roomId) {
      throw new BadRequestException('Room ID is required');
    }

    try {
      const updatedTransaction = await this.transactionService.update(
        new Types.ObjectId(socket.data.transactionId),
        { status },
      );
      this.wss
        .to(roomId.toString())
        .emit('transactionUpdated', updatedTransaction);
    } catch (error) {
      throw new Error('Transaction update failed');
    }
  }

  private async verifyUser(socket: Socket) {
    try {
      const token = socket.handshake.headers.authorization;
      if (!token) throw new UnauthorizedException('Token is missing');

      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('authentication.secret'),
      });

      return await this.profileService.getProfileByUserId(
        new Types.ObjectId(decoded._id),
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
