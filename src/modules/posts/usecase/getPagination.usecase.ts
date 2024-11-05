import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PostsService } from '../posts.service';
import GetPostsPaginationDto from '../dto/getPaginationPost.dto';
import { IPost } from '../posts.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class GetPostsPaginationUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: GetPostsPaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<IPost>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);
      const filter = {};

      if (data.status) {
        filter['status'] = data.status;
      }

      const [posts, total] = await this.postService.getPagination(
        filter,
        page,
        perPage,
      );

      return {
        data: posts,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
