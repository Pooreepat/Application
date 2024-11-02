import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { IUser } from '../interfaces/user.interface';
import { HttpResponsePagination } from 'src/interface/respones';
import GetUserPaginationDto from '../dtos/getPaginationUser.dto';

@Injectable()
export class GetPaginationUserUsecase {
  constructor(private readonly userService: UserService) {}

  public async execute(
    data: GetUserPaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<IUser>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const filter = {};

      if (data.search) {
        filter['username'] = { $regex: data.search, $options: 'i' };
      }

      if (data.role) {
        filter['role'] = { $in: [data.role] };
      }

      const [users, total] = await this.userService.getPagination(
        filter,
        page,
        perPage,
      );

      if (!users) {
        throw new HttpException('Cannot get user', 500);
      }

      return {
        data: users,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
