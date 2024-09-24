import { Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetProfilePaginationUsecase } from './usecase/getPagination.usecase';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetProfilePaginationDto from './dto/getPagination.dto';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getProfilePaginationUsecase: GetProfilePaginationUsecase,
  ) {}

  @Get()
  public async getPagination(@Query() query: GetProfilePaginationDto): Promise<any> {
    return this.getProfilePaginationUsecase.execute(query);
  }

  @Put()
    public async updateProfile(): Promise<any> {
        return {};
    }
}
