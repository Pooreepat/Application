import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MatchService } from './matches.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { AcceptMatchesUsecase } from './usecase/accept.usecase';
import GetMatchesPaginationDto from './dto/matches-getPagination.dto';
import { GetMatchesPaginationUsecase } from './usecase/getPagination.usecase';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly acceptMatchesUsecase: AcceptMatchesUsecase,
    private readonly getMatchesPaginationUsecase: GetMatchesPaginationUsecase,
  ) {}

  @Get('accept/:id')
  @ApiOperation({ summary: 'ยอมรับการสไลด์' })
  @ApiResponse({ status: 200, description: 'การสไลด์ถูกยอมรับแล้ว' })
  accept(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: string,
  ) {
    return this.acceptMatchesUsecase.execute({ id: id as any });
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
}
