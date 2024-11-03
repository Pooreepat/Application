import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import GetNewsPaginationDto from '../dtos/getPaginationNews.dto';
import { NewsService } from '../news.service';
import { INews } from '../news.interface';

@Injectable()
export class GetPaginationPetUsecase {
  constructor(private readonly newsService: NewsService) {}

  public async execute(
    data: GetNewsPaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<INews>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const filter = {};

      if (data.search) {
        filter['title'] = { $regex: data.search, $options: 'i' };
      }

      const [news, total] = await this.newsService.getPagination(
        filter,
        page,
        perPage,
      );

      if (!news) {
        throw new HttpException('Cannot get news', 500);
      }

      return {
        data: news,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
