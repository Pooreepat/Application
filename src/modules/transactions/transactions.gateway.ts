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
import { MatchService } from '../matches/matches.service';
import { PetService } from '../pet/pet.service';
import { Status } from '../pet/pet.constant';

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
    private readonly petService: PetService,
    private readonly transactionService: TransactionService,
    private readonly matchService: MatchService,
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
      if (!profile) {
        throw new UnauthorizedException('User not found');
      }
      socket.data.profile = profile;
    } catch (error) {
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const roomId = socket.data.roomId?.toString();
    const profileId = socket.data.profile?._id.toString();

    if (roomId && profileId) {
      const roomUsers = this.roomUsers.get(roomId);
      if (roomUsers) {
        roomUsers.forEach((user) => {
          if (user.profileId === profileId) {
            roomUsers.delete(user);
          }
        });

        if (roomUsers.size === 0) {
          this.roomUsers.delete(roomId);
        } else {
          this.server.to(roomId).emit('userListUpdated', Array.from(roomUsers));
        }
      }

      this.roomConfirmations.delete(roomId);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody('matchId') matchId: Types.ObjectId,
  ) {
    const roomId = matchId?.toString();

    if (!roomId) {
      throw new BadRequestException('Invalid room ID');
    }

    socket.join(roomId);
    socket.data.roomId = roomId;

    if (!this.roomConfirmations.has(roomId)) {
      this.roomConfirmations.set(roomId, new Set());
    }

    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    const roomUsers = this.roomUsers.get(roomId);
    const profile = socket.data.profile;
    roomUsers.add({ profileId: profile._id.toString(), name: profile.name });

    this.server.to(roomId).emit('userListUpdated', Array.from(roomUsers));

    const confirmations = this.roomConfirmations.get(roomId);
    this.server
      .to(roomId)
      .emit('confirmedTransactionUser', Array.from(confirmations));
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
      return;
    }

    confirmations.add(profileId);

    if (confirmations.size >= 2) {
      try {
        const match = await this.matchService.update(
          new Types.ObjectId(roomId),
          {
            isTransaction: true,
          },
        );
        if (!match) {
          throw new BadRequestException('Match not found');
        }
        await this.matchService.removeMatches(
          new Types.ObjectId(match._petId),
          new Types.ObjectId(match._id),
        );
        const transaction = await this.transactionService.create({
          _matchId: new Types.ObjectId(roomId),
          _petId: new Types.ObjectId(match._petId),
          _profile1Id: new Types.ObjectId(match._profile1Id),
          _profile2Id: new Types.ObjectId(match._profile2Id),
        });
        if (!transaction) {
          throw new BadRequestException('Transaction creation failed');
        }
        const pet = await this.petService.update(
          new Types.ObjectId(match._petId),
          {
            _profileId: new Types.ObjectId(match._profile1Id),
            status: Status.SUCCESSFUL,
          },
        );
        if (!pet) {
          throw new BadRequestException('Pet not found');
        }
        this.server.to(roomId).emit('transactionConfirmed', transaction);
        this.roomConfirmations.delete(roomId);
      } catch (error) {
        throw new BadRequestException('Transaction creation failed');
      }
    } else {
      this.server.to(roomId).emit('confirmationReceived', { profileId });
    }
  }

  private async verifyUser(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    if (!token) throw new UnauthorizedException('Token is missing');

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('authentication.secret'),
      });

      return this.profileService.getProfileByUserId(
        new Types.ObjectId(decoded._id),
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
