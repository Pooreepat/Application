import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument } from './news.schema';
import { INews } from './news.interface';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  public async getPagination(
    filterQuery: any,
    page: number,
    perPage: number,
  ): Promise<[NewsDocument[], number]> {
    const data = await this.newsModel
      .aggregate([
        {
          $match: filterQuery,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: (page - 1) * perPage,
        },
        {
          $limit: perPage,
        },
      ])
      .exec();
    const total = await this.newsModel.countDocuments(filterQuery);
    return [data, total];
  }

  public async getNewsById(newsId: Types.ObjectId): Promise<INews> {
    return this.newsModel.findById(newsId).lean();
  }

  public async createNews(data: Partial<NewsDocument>): Promise<NewsDocument> {
    return this.newsModel.create(data);
  }

  public async updateNews(
    newsId: Types.ObjectId,
    data: Partial<NewsDocument>,
  ): Promise<INews> {
    return this.newsModel.findByIdAndUpdate(newsId, data, { new: true }).lean();
  }

  public async deleteNews(id: Types.ObjectId): Promise<News> {
    return this.newsModel.findByIdAndDelete(id).lean();
  }
}
