import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { NewsService } from '../news.service';
import { INews } from '../news.interface';

@Injectable()
export class DeleteNewsByIdUsecase {
  constructor(private readonly newsService: NewsService) {}

  public async execute(id: string, user: IUser): Promise<{ message: string; status: number }> {
    try {
      const news = await this.newsService.deleteNews(new Types.ObjectId(id));

      if (!news) {
        throw new HttpException('ไม่พบข่าว', 404);
      }

      return {
        message: 'ลบข่าวสำเร็จ',
        status: 200,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
