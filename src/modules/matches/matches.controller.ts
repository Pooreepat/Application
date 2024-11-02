import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { IUser } from '../user/interfaces/user.interface';
import { HttpResponsePagination } from 'src/interface/respones';
import { IMatch } from './matches.interface';
import GetMatchPaginationDto from './dtos/getPaginationMatch.dto';
import { GetPaginationMatchUsecase } from './usecases/getPaginationMatch.usecase';
import { GetMatchByIdUsecase } from './usecases/getMatchById.usecase';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchController {
  constructor(
    private readonly getPaginationMatchUsecase: GetPaginationMatchUsecase,
    private readonly getMatchByIdUsecase: GetMatchByIdUsecase,
  ) {}

  @Get()
  public async getPagination(
    @User() user: IUser,
    @Query() query: GetMatchPaginationDto,
  ): Promise<HttpResponsePagination<IMatch>> {
    return this.getPaginationMatchUsecase.execute(query, user);
  }

  @Get(":id")
  @ApiParam({ name: 'id', type: String, description: 'The id of the user' })
  public async getMatchById(
    @User() user: IUser,
    @Param('id') id: string,
  ): Promise<IMatch> {
    return this.getMatchByIdUsecase.execute(id, user);
  }
}
