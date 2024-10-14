import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetProfilePaginationUsecase } from './usecase/getPagination.usecase';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import GetProfilePaginationDto from './dto/getPagination.dto';
import UpdateProfileDto from './dto/update.dto';
import { UpdateProfileUsecase } from './usecase/update.usecase';
import { IProfile } from './profile.interface';
import { User } from '../user/user.decorator';
import { IUser } from '../user/user.interface';
import { ProfileTransformUserPipe } from './pipe/merchant-transform-user.pipe';
import { GetByIdProfileUsecase } from './usecase/getById.usecase';
import { Types } from 'mongoose';
import { DeleteProfileUsecase } from './usecase/DeleteById.usecase copy';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getProfilePaginationUsecase: GetProfilePaginationUsecase,
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly getByIdProfileUsecase: GetByIdProfileUsecase,
    private readonly deleteProfileUsecase: DeleteProfileUsecase,
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

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the profile' })
  public async getProfileById(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.getByIdProfileUsecase.execute(id);
  }

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

  @Put(':id')
  public async updateProfile(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: string,
    @Body() data: UpdateProfileDto,
  ): Promise<any> {
    return this.updateProfileUsecase.execute({
      ...data,
      id,
    });
  }

  @Delete(':id')
  public async deleteProfile(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.deleteProfileUsecase.execute(id);
  }
}
