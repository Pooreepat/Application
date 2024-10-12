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

@WebSocketGateway({
  namespace: '/transactions',
  cors: { origin: '*' },
})
export class TransactionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;
  private roomConfirmations = new Map<string, Set<string>>();
  private roomUsers = new Map<
    string,
    Set<{ profileId: string; name: string }>
  >();

  constructor(
    private readonly transactionService: TransactionService,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    console.log('Transaction WebSocket initialized.');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const profile = await this.verifyUser(socket);
      socket.data.profile = profile;
      console.log(`User connected: ${profile._id}`);
    } catch (error) {
      console.error('User verification failed:', error);
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const roomId = socket.data.roomId?.toString();
    const profileId = socket.data.profile?._id.toString();

    if (roomId && profileId) {
      // Remove user from the roomUsers map
      const roomUsers = this.roomUsers.get(roomId);
      if (roomUsers) {
        roomUsers.delete({ profileId, name: socket.data.profile.name });
        if (roomUsers.size === 0) {
          this.roomUsers.delete(roomId);
        } else {
          this.server.to(roomId).emit('userListUpdated', Array.from(roomUsers));
        }
      }

      this.roomConfirmations.delete(roomId);
      console.log(`User disconnected from room: ${roomId}`);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('matchId') matchId: Types.ObjectId,
  ) {
    const roomId = matchId?.toString();
    const profile = socket.data.profile;

    if (!roomId) {
      throw new BadRequestException('Invalid room ID');
    }

    socket.join(roomId);
    socket.data.roomId = roomId;
    console.log(`User joined room: ${roomId}`);

    if (!this.roomConfirmations.has(roomId)) {
      this.roomConfirmations.set(roomId, new Set());
    }

    // Add the user to the roomUsers map
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    const roomUsers = this.roomUsers.get(roomId);
    roomUsers.add({ profileId: profile._id.toString(), name: profile.name });

    // Send the updated user list to all users in the room
    this.server.to(roomId).emit('userListUpdated', Array.from(roomUsers));
  }

  @SubscribeMessage('confirmTransaction')
  async handleConfirmTransaction(@ConnectedSocket() socket: Socket) {
    const roomId = socket.data.roomId;
    const profileId = socket.data.profile._id.toString();

    if (!roomId) {
      throw new BadRequestException('Room ID is required');
    }

    const confirmations = this.roomConfirmations.get(roomId);
    if (!confirmations) {
      throw new BadRequestException('No room found for confirmation');
    }

    if (confirmations.has(profileId)) {
      console.log(`User ${profileId} has already confirmed the transaction`);
      return;
    }

    console.log(`User ${profileId} confirmed the transaction`);
    confirmations.add(profileId);

    if (confirmations.size >= 2) {
      console.log(
        `All participants have confirmed the transaction in room: ${roomId}`,
      );

      try {
        const transaction = await this.transactionService.create({
          _matchId: new Types.ObjectId(roomId),
        });
        this.server.to(roomId).emit('transactionConfirmed', transaction);
        this.roomConfirmations.delete(roomId);
      } catch (error) {
        console.error('Error during transaction creation:', error);
        throw new BadRequestException('Transaction creation failed');
      }
    } else {
      console.log(
        `Waiting for other participants to confirm in room: ${roomId}`,
      );
      this.server.to(roomId).emit('confirmationReceived', { profileId });
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
