import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News, NewsSchema } from './news.schema';
import { CreateNewsUsecase } from './usecases/createNews.usecase';
import { GetPaginationPetUsecase } from './usecases/getPaginationNews.usecase';
import { UpdateNewsUsecase } from './usecases/updateNews.usecase';
import { DeleteNewsByIdUsecase } from './usecases/deleteNewsById.usecase';
import { GetNewsByIdUsecase } from './usecases/getNewsById.usecase';

const usecases = [
  CreateNewsUsecase,
  GetPaginationPetUsecase,
  UpdateNewsUsecase,
  DeleteNewsByIdUsecase,
  GetNewsByIdUsecase,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  providers: [NewsService, ...usecases],
  controllers: [NewsController],
})
export class NewsModule {}
