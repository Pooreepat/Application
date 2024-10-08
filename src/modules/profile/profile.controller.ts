import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetProfilePaginationUsecase } from './usecase/getPagination.usecase';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import GetProfilePaginationDto from './dto/getPagination.dto';
import UpdateProfileDto from './dto/update.dto';
import { UpdateProfileUsecase } from './usecase/update.usecase';
import { IProfile } from './profile.interface';
import { User } from '../user/user.decorator';
import { IUser } from '../user/user.interface';
import { ProfileTransformUserPipe } from './pipe/merchant-transform-user.pipe';
import { GetByIdProfileUsecase } from './usecase/getById.usecase';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getProfilePaginationUsecase: GetProfilePaginationUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    // private readonly getByIdProfileUsecase: GetByIdProfileUsecase,
  ) {}

  @Get()
  public async getPagination(
    @Query() query: GetProfilePaginationDto,
  ): Promise<any> {
    return this.getProfilePaginationUsecase.execute(query);
  }

  @Get('self')
  public async getProfile(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
  ): Promise<any> {
    return user.profile;
  }

  // @Get(':id')
  // public async getProfileById(@Param('id') id: string): Promise<any> {
  //   return this.getByIdProfileUsecase.execute(id);
  // }

  @Put('self')
  public async updateSelfProfile(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() data: UpdateProfileDto,
  ): Promise<any> {
    return this.updateProfileUsecase.execute({
      ...data,
      id: user.profile._id,
    });
  }

  // @Put(':id')
  // public async updateProfile(
  //   @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
  //   @Param('id') id: string,
  //   @Body() data: UpdateProfileDto,
  // ): Promise<any> {
  //   return this.updateProfileUsecase.execute({
  //     ...data,
  //     id,
  //   });
  // }
}
