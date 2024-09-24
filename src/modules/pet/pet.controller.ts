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
import GetPetPaginationDto from './dto/getPagination.dto';
import { User } from '../user/user.decorator';
import UpdatePetDto from './dto/update.dto';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';
import { CreatePetUsecase } from './usecase/create.usecase';

@ApiTags('pet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pet')
export class PetController {
  constructor(
    private readonly getPetPaginationUsecase: GetPetPaginationUsecase,
    private readonly updatePetUsecase: UpdatePetUsecase,
    private readonly getByIdPetUsecase: GetByIdPetUsecase,
    private readonly createPetUsecase: CreatePetUsecase,
  ) {}

  @Post()
  public async createPet(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() data: UpdatePetDto,
  ): Promise<any> {
    return this.updatePetUsecase.execute({
      ...data,
      id: user.profile._id,
    });
  }

  @Get()
  public async getPagination(
    @Query() query: GetPetPaginationDto,
  ): Promise<any> {
    return this.getPetPaginationUsecase.execute(query);
  }

  //   @Get('self')
  //   public async getPet(
  //     @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
  //   ): Promise<any> {
  //     return user.profile;
  //   }

  @Get(':id')
  public async getPetById(@Param('id') id: string): Promise<any> {
    return this.getByIdPetUsecase.execute(id);
  }

  @Put('self')
  public async updateSelfPet(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() data: UpdatePetDto,
  ): Promise<any> {
    return this.updatePetUsecase.execute({
      ...data,
      id: user.profile._id,
    });
  }

  @Put(':id')
  public async updatePet(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Param('id') id: string,
    @Body() data: UpdatePetDto,
  ): Promise<any> {
    return this.updatePetUsecase.execute({
      ...data,
      id,
    });
  }
}
