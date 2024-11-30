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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { UpdatePetUsecase } from './usecases/update.usecase';
import { GetPetByIdUsecase } from './usecases/getPetById.usecase';
import { GetPaginationPetUsecase } from './usecases/getPaginationPet.usecase';
import { CreatePetUsecase } from './usecases/createPet.usecase';
import { IUser } from '../user/interfaces/user.interface';
import { CreatePetDto } from './dtos/createPet.dto';
import { IPet } from './pet.interface';
import { UpdatePetDto } from './dtos/updatePet.dto';
import { HttpResponsePagination } from 'src/interface/respones';
import SearchPetDto from './dtos/searchPets.dto';
import { SearchPetsUsecase } from './usecases/searchPets.usecase';
import GetPetPaginationDto from './dtos/getPaginationPet.dto';
import { GetPetByFaceIdUsecase } from './usecases/getPetByFaceId.usecase';

@ApiTags('Pet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pet')
export class PetController {
  constructor(
    private readonly updatePetUsecase: UpdatePetUsecase,
    private readonly getPetByIdUsecase: GetPetByIdUsecase,
    private readonly getPetByFaceIdUsecase: GetPetByFaceIdUsecase,
    private readonly getPaginationPetUsecase: GetPaginationPetUsecase,
    private readonly createPetUsecase: CreatePetUsecase,
    private readonly searchPetsUsecase: SearchPetsUsecase,
  ) {}

  @Get('find-face-id/:id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the pet' })
  public async getPetFaceById(
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<IPet> {
    return this.getPetByFaceIdUsecase.execute(id, user);
  }

  @Post('search')
  public async searchPets(
    @User() user: IUser,
    @Body() data: SearchPetDto,
  ): Promise<IPet[]> {
    return this.searchPetsUsecase.execute(data, user);
  }

  @Post()
  public async createPet(
    @User() user: IUser,
    @Body() data: CreatePetDto,
  ): Promise<IPet> {
    return this.createPetUsecase.execute(data, user);
  }

  @Get()
  public async getPagination(
    @User() user: IUser,
    @Query() query: GetPetPaginationDto,
  ): Promise<HttpResponsePagination<IPet>> {
    return this.getPaginationPetUsecase.execute(query, user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the pet' })
  public async getPetById(
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<IPet> {
    return this.getPetByIdUsecase.execute(id, user);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the pet' })
  public async updatePet(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() data: UpdatePetDto,
  ): Promise<IPet> {
    return this.updatePetUsecase.execute(data, id, user);
  }
}
