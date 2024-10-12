import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { UserService } from '../user.service';
import { IUser } from '../user.interface';

@Injectable()
export class GetByIdUserUsecase {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {}

  public async execute(id: Types.ObjectId): Promise<IUser> {
    try {
      const user = await this.userService.getUserById(
        new Types.ObjectId(id),
      );

      if (!user) {
        throw new HttpException('ไม่ผู้ใช้งาน', 404);
      }

      return user;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
