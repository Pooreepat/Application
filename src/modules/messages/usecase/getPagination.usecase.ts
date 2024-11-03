import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import GetMessagePaginationDto from '../dto/getPaginationMessage.dto';
import { MessageService } from '../messages.service';
import { Types } from 'mongoose';
import { IMessage } from '../messages.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class GetMessagePaginationUsecase {
  constructor(private readonly messageService: MessageService) {}

  public async execute(
    data: GetMessagePaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<IMessage>> {
    try {
      const id = data.id;
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const [messages, total] = await this.messageService.getPagination(
        {
          _matchId: new Types.ObjectId(id),
        },
        page,
        perPage,
      );
      if (!messages) {
        throw new HttpException('Cannot get messages', 500);
      }
      return {
        data: messages,
        total,
        page,
        perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
