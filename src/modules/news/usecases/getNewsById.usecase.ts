import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { NewsService } from '../news.service';
import { INews } from '../news.interface';

@Injectable()
export class GetNewsByIdUsecase {
  constructor(private readonly newsService: NewsService) {}

  public async execute(id: string, user: IUser): Promise<INews> {
    try {
      const news = await this.newsService.getNewsById(new Types.ObjectId(id));

      if (!news) {
        throw new HttpException('ไม่พบข่าว', 404);
      }

      return news;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
