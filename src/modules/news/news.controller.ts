import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  async createNews(@Body() createNewsDto: CreateNewsDto): Promise<News> {
    return this.newsService.createNews(createNewsDto);
  }

  @Get()
  async getAllNews(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  async getNewsById(@Param('id') id: string): Promise<News> {
    return this.newsService.findById(id);
  }

  @Put(':id')
  async updateNews(
    @Param('id') id: string,
    @Body() createNewsDto: CreateNewsDto
  ): Promise<News> {
    return this.newsService.updateNews(id, createNewsDto);
  }

  @Delete(':id')
  async deleteNews(@Param('id') id: string): Promise<void> {
    return this.newsService.deleteNews(id);
  }
}
