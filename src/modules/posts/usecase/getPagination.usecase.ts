import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PostsService } from '../posts.service';
import GetPostsPaginationDto from '../dto/getPagination.dto';

@Injectable()
export class GetPaginationUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: GetPostsPaginationDto,
  ): Promise<HttpResponsePagination> {
    try {
      const { page, perPage } = data;
      const skip = (Number(page) - 1) * Number(perPage);
      const [posts, total] = await this.postService.getPagination(
        {},
        skip,
        Number(perPage),
      );

      if (!posts) {
        throw new HttpException('Cannot get posts', 500);
      }

      if (!total) {
        throw new HttpException('Cannot get total posts', 500);
      }

      return {
        data: posts as any,
        total: Number(total),
        page: Number(page),
        perPage: Number(perPage),
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
