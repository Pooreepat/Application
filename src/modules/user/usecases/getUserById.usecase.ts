import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserService } from '../user.service';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class GetUserByIdUsecase {
  constructor(
    private readonly userService: UserService,
  ) {}

  public async execute(id: string, user: IUser): Promise<IUser> {
    try {
      const getUser = await this.userService.getUserById(
        new Types.ObjectId(id),
      );

      if (!getUser) {
        throw new HttpException('ไม่ผู้ใช้งาน', 404);
      }

      return getUser;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
