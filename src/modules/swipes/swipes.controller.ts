import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUser } from '../user/interfaces/user.interface';
import { CreateSwipesDto } from './dtos/createSwipes.dto';
import { CreateSwipesUsecase } from './usecases/createSwipes.usecase';
import { ISwipe } from './swipes.interface';
import { HttpResponsePagination } from 'src/interface/respones';
import GetSwipePaginationDto from './dtos/getPagination.dto';
import { GetPaginationSwipeUsecase } from './usecases/getPaginationSwipe.usecase';
import { ActionSwipesUsecase } from './usecases/actionSwipes.usecase';

@ApiTags('Swipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('swipes')
export class SwipeController {
  constructor(
    private readonly getPaginationSwipeUsecase: GetPaginationSwipeUsecase,
    private readonly createSwipesUsecase: CreateSwipesUsecase,
    private readonly actionSwipesUsecase: ActionSwipesUsecase,
  ) {}

  @Post()
  createSwipe(
    @User() user: IUser,
    @Body() data: CreateSwipesDto,
  ): Promise<ISwipe> {
    return this.createSwipesUsecase.execute(data, user);
  }

  @Get()
  public async getPagination(
    @User() user: IUser,
    @Query() query: GetSwipePaginationDto,
  ): Promise<HttpResponsePagination<ISwipe>> {
    return this.getPaginationSwipeUsecase.execute(query, user);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the swipe' })
  public async actionSwipe(
    @Param('id') id: string,
    @Query('status') status: 'accepted' | 'rejected',
    @User() user: IUser,
  ): Promise<ISwipe> {
    return this.actionSwipesUsecase.execute(status, id, user);
  }
}
