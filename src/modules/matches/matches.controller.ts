import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MatchService } from './matches.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { UpdateStatusMatchUsecase } from './usecase/update-status.usecase';
import GetMatchesPaginationDto from './dto/matches-getPagination.dto';
import { GetMatchesPaginationUsecase } from './usecase/getPagination.usecase';
import { MatchUpdateStatusDto } from './dto/matches-update-status.dto';
import { Types } from 'mongoose';
import { GetByIdMatchUsecase } from './usecase/getById.usecase';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly updateStatusMatchUsecase: UpdateStatusMatchUsecase,
    private readonly getMatchesPaginationUsecase: GetMatchesPaginationUsecase,
    private readonly getByIdMatchUsecase: GetByIdMatchUsecase,
  ) {}

  @Get('status/:id')
  @ApiOperation({ summary: 'ยอมรับการสไลด์' })
  @ApiResponse({ status: 200, description: 'การสไลด์ถูกยอมรับแล้ว' })
  accept(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: Types.ObjectId,
    @Query() query: MatchUpdateStatusDto,
  ) {
    return this.updateStatusMatchUsecase.execute({ ...query, id });
  }

  // @Get()
  // findAll() {
  //   return this.matchService.findAll();
  // }

  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetMatchesPaginationDto,
  ): Promise<any> {
    return this.getMatchesPaginationUsecase.execute(query, user.profile);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the match' })
  public async getMatchById(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.getByIdMatchUsecase.execute(id);
  }
}
