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
import { RegisterUserUsecase } from './usecases/register.usecase';
import { CreateOfficerUsecase } from './usecases/createOfficer.usecase';
import { GetUserByIdUsecase } from './usecases/getUserById.usecase';
import CreateOfficerDto from './dtos/createOfficer.dto';
import { IUser } from './interfaces/user.interface';
import { User } from './user.decorator';
import RegisterUserDto from './dtos/registerUser.dto';
import { GetPaginationUserUsecase } from './usecases/getPaginationUser.usecase';
import { HttpResponsePagination } from 'src/interface/respones';
import { UpdateUserUsecase } from './usecases/update.usecase';
import UpdateUserDto from './dtos/updateUser.dto';
import GetUserPaginationDto from './dtos/getPaginationUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly createOfficerUsecase: CreateOfficerUsecase,
    private readonly getUserByIdUsecase: GetUserByIdUsecase,
    private readonly registerUserUsecase: RegisterUserUsecase,
    private readonly getPaginationUserUsecase: GetPaginationUserUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
  ) {}

  @Post('register')
  public async register(@Body() data: RegisterUserDto): Promise<IUser> {
    return this.registerUserUsecase.execute(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getPagination(
    @Query() query: GetUserPaginationDto,
    @User() user: IUser,
  ): Promise<HttpResponsePagination<IUser>> {
    return this.getPaginationUserUsecase.execute(query, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async create(
    @User() user: IUser,
    @Body() data: CreateOfficerDto,
  ): Promise<IUser> {
    return this.createOfficerUsecase.execute(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('self')
  public async profile(@User() user: IUser): Promise<IUser> {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the user' })
  public async getUser(
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<IUser> {
    return this.getUserByIdUsecase.execute(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiParam({ name: 'id', type: String, description: 'The id of the user' })
  public async update(
    @Param('id') id: string,
    @User() user: IUser,
    @Body() data: UpdateUserDto,
  ): Promise<IUser> {
    return this.updateUserUsecase.execute(data, id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('self')
  public async updateSelf(
    @Body() data: UpdateUserDto,
    @User() user: IUser,
  ): Promise<IUser> {
    return this.updateUserUsecase.execute(data, user._id, user);
  }
}
