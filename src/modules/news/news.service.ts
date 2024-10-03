import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './news.schema';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async createNews(createNewsDto: CreateNewsDto): Promise<News> {
    const newPost = new this.newsModel(createNewsDto);
    return await newPost.save();
  }

  async findAll(): Promise<News[]> {
    return await this.newsModel.find().exec();
  }

  async findById(id: string): Promise<News> {
    const post = await this.newsModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException('News post not found');
    }
    return post;
  }

  async updateNews(id: string, createNewsDto: CreateNewsDto): Promise<News> {
    const updatedPost = await this.newsModel.findByIdAndUpdate(id, createNewsDto, { new: true }).exec();
    if (!updatedPost) {
      throw new NotFoundException('News post not found');
    }
    return updatedPost;
  }

  async deleteNews(id: string): Promise<void> {
    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('News post not found');
    }
  }
}
