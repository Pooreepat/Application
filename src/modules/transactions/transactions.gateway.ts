import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { TransactionService } from './transactions.service';
import { TransactionStatus } from './transactions.constant';

@WebSocketGateway({
  namespace: '/transactions',
  cors: { origin: '*' },
})
export class TransactionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private wss: Server;

  private roomConfirmations = new Map<string, Set<string>>(); // Track confirmations per room

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
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.roomConfirmations.delete(socket.data.roomId?.toString());
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('matchId') matchId: Types.ObjectId,
  ) {
    const roomId = matchId?.toString();
    if (!roomId) return;
console.log(`joined room ${roomId}`);
    socket.join(roomId);
    socket.data.roomId = roomId;
    if (!this.roomConfirmations.has(roomId)) {
      this.roomConfirmations.set(roomId, new Set());
    }
  }

  @SubscribeMessage('createTransaction')
  async handleCreateTransaction(@ConnectedSocket() socket: Socket) {
    const roomId = socket.data.roomId;
    if (!roomId) throw new BadRequestException('Room ID is required');

    const transaction = await this.transactionService.create({
      _matchId: new Types.ObjectId(roomId),
      status: TransactionStatus.PENDING,
    });
    socket.data.transactionId = transaction._id;

    this.wss.to(roomId).emit('transactionCreated', transaction);
  }

  @SubscribeMessage('confirmTransaction')
  async handleConfirmTransaction(@ConnectedSocket() socket: Socket) {
    const roomId = socket.data.roomId;
    const profileId = socket.data.profile._id.toString();
    if (!roomId) throw new BadRequestException('Room ID is required');

    const confirmations = this.roomConfirmations.get(roomId);
console.log(confirmations)
    if (confirmations.has(profileId)) {
      console.log(`has already confirmed the transaction`);
      return;
    }
    console.log(`has confirmed the transaction`);

    confirmations.add(profileId);

    if (confirmations.size >= 2) {
      const updatedTransaction = await this.transactionService.update(
        new Types.ObjectId(socket.data.transactionId),
        { status: TransactionStatus.COMPLETED },
      );
      this.wss.to(roomId).emit('transactionConfirmed', updatedTransaction);
      this.roomConfirmations.delete(roomId);
    } else {
      this.wss.to(roomId).emit('confirmationReceived', { profileId });
    }
  }

  private async verifyUser(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    if (!token) throw new UnauthorizedException('Token is missing');

    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('authentication.secret'),
    });

    return this.profileService.getProfileByUserId(
      new Types.ObjectId(decoded._id),
    );
  }
}
