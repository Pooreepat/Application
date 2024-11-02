import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserService } from '../user.service';
import UpdateUserDto from '../dtos/updateUser.dto';
import { IUser } from '../interfaces/user.interface';
import { EUserRole } from '../constants/user.constant';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userService: UserService) {}

  public async execute(
    data: UpdateUserDto,
    id: string | Types.ObjectId,
    user: IUser,
  ): Promise<IUser> {
    try {
      switch (user.role[0]) {
        case EUserRole.ADMIN:
          break;
        default:
          if (!new Types.ObjectId(id).equals(user._id)) {
            throw new HttpException('You do not have permission', 403);
          }
      }

      const updateUser = await this.userService.updateUser(
        new Types.ObjectId(id),
        data,
      );

      if (!updateUser) {
        throw new HttpException('Cannot update user', 500);
      }

      return updateUser;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
