import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import GetMessagePaginationDto from '../dto/message-getPagination.dto';
import { MessageService } from '../messages.service';
import { IProfile } from 'src/modules/profile/profile.interface';
import { Types } from 'mongoose';

@Injectable()
export class GetMessagePaginationUsecase {
  constructor(
    private readonly messageService: MessageService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: GetMessagePaginationDto,
    profile: IProfile,
  ): Promise<HttpResponsePagination> {
    try {
      const id = data.id;
      const page = Number(data.page) || 1;
      const perPage = Number(data.perPage) || 10;

      const skip = (page - 1) * perPage;
      const [messages, total] = await this.messageService.getPagination(
        {
          _matchId: new Types.ObjectId(id),
        },
        skip,
        perPage,
      );
      if (!messages) {
        throw new HttpException('ไม่พบข้อมูล', 404);
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
