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
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { TransactionService } from './transactions.service';
import { MatchService } from '../matches/matches.service';
import { PetService } from '../pet/pet.service';
import { UserService } from '../user/user.service';
import { IMatch } from '../matches/matches.interface';
import { IUser } from '../user/interfaces/user.interface';
import { EPetStatus } from '../pet/pet.constant';
import { UpdateTransactionDto } from './dto/transactions-update.dto';

@WebSocketGateway({
  namespace: '/transactions',
  cors: { origin: '*' },
})
export class TransactionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;

  private readonly rooms = new Map<
    string,
    { caretakerConfirmed: boolean; adopterConfirmed: boolean }
  >();

  constructor(
    private readonly petService: PetService,
    private readonly transactionService: TransactionService,
    private readonly matchService: MatchService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    console.log('Transaction WebSocket initialized.');
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const user = await this.verifyUser(socket);
      if (!user) {
        throw new UnauthorizedException();
      }
      socket.data.user = user;
    } catch (error) {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const match: IMatch = socket.data.match;
    const user: IUser = socket.data.user;
    if (!match || !user) return;
    const room = this.rooms.get(match._id.toString());
    if (!room) return;
    const isCaretaker = match._caretakerId.equals(user._id);
    if (isCaretaker) {
      room.caretakerConfirmed = false;
    } else {
      room.adopterConfirmed = false;
    }
    this.server.to(match._id.toString()).emit('status', room);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    const { matchId } = data;
    const match = await this.matchService.findMatchById(
      new Types.ObjectId(matchId),
    );
    if (!match) return;

    if (!this.rooms.has(matchId)) {
      this.rooms.set(matchId, {
        caretakerConfirmed: false,
        adopterConfirmed: false,
      });
    }
    socket.data.match = match;
    socket.join(matchId);
    this.server
      .to(matchId)
      .emit('userJoined', { userId: socket.data.user._id });

    const room = this.rooms.get(matchId);
    this.server.to(matchId).emit('status', room);
  }

  @SubscribeMessage('confirmParticipation')
  async confirmParticipation(@ConnectedSocket() socket: Socket) {
    const match: IMatch = socket.data.match;
    const user: IUser = socket.data.user;
    if (!match || !user) return;

    if (!this.rooms.has(match._id.toString())) {
      throw new BadRequestException('Room does not exist');
    }

    const room = this.rooms.get(match._id.toString());

    const isCaretaker = match._caretakerId.equals(user._id);
    if (isCaretaker) {
      room.caretakerConfirmed = true;
    } else {
      room.adopterConfirmed = true;
    }

    this.server.to(match._id.toString()).emit('status', room);
  }

  @SubscribeMessage('confirmTransactionByCaretaker')
  async sendImage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: UpdateTransactionDto,
  ) {
    const { images } = data;
    if (images.length < 1) {
      throw new BadRequestException('Images are required');
    }

    const match: IMatch = socket.data.match;
    const user: IUser = socket.data.user;
    if (!match || !user) return;

    const room = this.rooms.get(match._id.toString());

    if (!room.caretakerConfirmed || !room.adopterConfirmed) {
      throw new BadRequestException('Both users must confirm participation');
    }

    await this.transactionService.createTransaction({
      _matchId: match._id,
      _caretakerId: match._caretakerId,
      _adopterId: match._adopterId,
      _petId: match._petId,
      images,
    });

    await this.petService.updatePet(match._petId, {
      status: EPetStatus.COMPLETED,
      _adopterId: match._adopterId,
    });

    await this.matchService.updateMatch(match._id, { isTransaction: true });

    this.server
      .to(match._id.toString())
      .emit('confirmationStatus', { status: 'success' });
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
