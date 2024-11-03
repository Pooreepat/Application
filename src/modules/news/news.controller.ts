import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateNewsDto } from './dtos/createNews.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNewsUsecase } from './usecases/createNews.usecase';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { IUser } from '../user/interfaces/user.interface';
import { INews } from './news.interface';
import GetNewsPaginationDto from './dtos/getPaginationNews.dto';
import { HttpResponsePagination } from 'src/interface/respones';
import { GetPaginationPetUsecase } from './usecases/getPaginationNews.usecase';
import { UpdateNewsUsecase } from './usecases/updateNews.usecase';
import { GetNewsByIdUsecase } from './usecases/getNewsById.usecase';
import { DeleteNewsByIdUsecase } from './usecases/deleteNewsById.usecase';

@ApiTags('News')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(
    private readonly createNewsUsecase: CreateNewsUsecase,
    private readonly getPaginationPetUsecase: GetPaginationPetUsecase,
    private readonly updateNewsUsecase: UpdateNewsUsecase,
    private readonly deleteNewsByIdUsecase: DeleteNewsByIdUsecase,
    private readonly getNewsByIdUsecase: GetNewsByIdUsecase,
  ) {}

  @Post()
  public async createNews(
    @User() user: IUser,
    @Body() data: CreateNewsDto,
  ): Promise<INews> {
    return this.createNewsUsecase.execute(data, user);
  }

  @Get()
  public async getPagination(
    @User() user: IUser,
    @Query() query: GetNewsPaginationDto,
  ): Promise<HttpResponsePagination<INews>> {
    return this.getPaginationPetUsecase.execute(query, user);
  }

  @Put(':id')
  public async updateNews(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() data: CreateNewsDto,
  ): Promise<INews> {
    return this.updateNewsUsecase.execute(data, id, user);
  }

  @Delete(':id')
  public async deleteNews(
    @User() user: IUser,
    @Param('id') id: string,
  ): Promise<{ message: string; status: number }> {
    return this.deleteNewsByIdUsecase.execute(id, user);
  }

  @Get(':id')
  public async getNewsById(
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<INews> {
    return this.getNewsByIdUsecase.execute(id, user);
  }
}
