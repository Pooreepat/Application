import { HttpException, Injectable } from '@nestjs/common';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { Types } from 'mongoose';
import { NewsService } from '../news.service';
import { UpdateNewsDto } from '../dtos/updateNews.dto';
import { INews } from '../news.interface';

@Injectable()
export class UpdateNewsUsecase {
  constructor(private readonly newsService: NewsService) {}

  public async execute(
    data: UpdateNewsDto,
    id: string,
    user: IUser,
  ): Promise<INews> {
    try {
      switch (user.role[0]) {
        case EUserRole.ADMIN:
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const newsUpdate = await this.newsService.updateNews(
        new Types.ObjectId(id),
        {
          title: data.title,
          content: data.content,
          images: data.images,
          tags: data.tags,
          type: data.type,
        },
      );

      if (!newsUpdate) {
        throw new HttpException('Cannot update news', 500);
      }

      return newsUpdate;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
