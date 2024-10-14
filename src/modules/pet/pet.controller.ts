import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetPetPaginationUsecase } from './usecase/getPagination.usecase';
import { UpdatePetUsecase } from './usecase/update.usecase';
import { GetByIdPetUsecase } from './usecase/getById.usecase';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import GetPetPaginationDto from './dto/pet-getPagination.dto';
import { User } from '../user/user.decorator';
import UpdatePetDto from './dto/pet-update.dto';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { CreatePetUsecase } from './usecase/create.usecase';
import { PetCreateDto } from './dto/pet-create.dto';
import { SearchPetUsecase } from './usecase/search.usecase';
import PetSearchDto from './dto/pet-search.dto';
import { Types } from 'mongoose';

@ApiTags('Pet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pet')
export class PetController {
  constructor(
    private readonly getPetPaginationUsecase: GetPetPaginationUsecase,
    private readonly updatePetUsecase: UpdatePetUsecase,
    private readonly getByIdPetUsecase: GetByIdPetUsecase,
    private readonly createPetUsecase: CreatePetUsecase,
    private readonly searchPetUsecase: SearchPetUsecase,
  ) {}

  @Post('search')
  public async searchPet(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() data: PetSearchDto,
  ): Promise<any> {
    return this.searchPetUsecase.execute({ ...data, profile: user.profile });
  }

  @Post()
  public async createPet(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() data: PetCreateDto,
  ): Promise<any> {
    return this.createPetUsecase.execute({
      ...data,
      id: user.profile._id,
    });
  }

  @Get()
  public async getPagination(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Query() query: GetPetPaginationDto,
  ): Promise<any> {
    return this.getPetPaginationUsecase.execute(query, user.profile);
  }

  //   @Get('self')
  //   public async getPet(
  //     @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
  //   ): Promise<any> {
  //     return user.profile;
  //   }

  @Get(':id')
  public async getPetById(@Param('id') id: Types.ObjectId): Promise<any> {
    return this.getByIdPetUsecase.execute(id);
  }

  // @Put('self')
  // public async updateSelfPet(
  //   @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
  //   @Body() data: UpdatePetDto,
  // ): Promise<any> {
  //   return this.updatePetUsecase.execute(
  //     {
  //       ...data,
  //     },
  //     user,
  //   );
  // }

  @Put(':id')
  public async updatePet(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: string,
    @Body() data: UpdatePetDto,
  ): Promise<any> {
    return this.updatePetUsecase.execute(
      {
        ...data,
        id,
      },
      user,
    );
  }
}
