import { HttpException, Injectable } from '@nestjs/common';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';
import { NewsService } from '../news.service';
import { CreateNewsDto } from '../dtos/createNews.dto';
import { INews } from '../news.interface';

@Injectable()
export class CreateNewsUsecase {
  constructor(private readonly newsService: NewsService) {}

  public async execute(data: CreateNewsDto, user: IUser): Promise<INews> {
    try {
      switch (user.role[0]) {
        case EUserRole.ADMIN:
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

      const newsCreate = await this.newsService.createNews({
        _authorId: user._id,
        title: data.title,
        content: data.content,
        images: data.images,
        tags: data.tags,
        type: data.type,
      });

      if (!newsCreate) {
        throw new HttpException('Cannot create news', 500);
      }

      return newsCreate;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
