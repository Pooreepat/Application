import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpRespons } from 'src/interface/respones';
import { MessageCreateDto } from '../dto/message-create.dto';
import { IProfile } from 'src/modules/profile/profile.interface';
import { MessageService } from '../messages.service';

@Injectable()
export class CreateMessageUsecase {
  constructor(
    private readonly messageService: MessageService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: MessageCreateDto & { profile: IProfile },
  ): Promise<HttpRespons> {
    try {
      const { profile } = data;
      const message = await this.messageService.create({
        ...data,
        _matcheId: data._matcheId as any,
        type: data.type as any,
        _senderId: profile._id,
      });

      if (!message) {
        throw new HttpException('ไม่สามารถสร้างข้อความได้', 500);
      }

      return {
        message: 'สร้างข้อความสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
