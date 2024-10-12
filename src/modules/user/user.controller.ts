import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RegisterUsecase } from './usecase/register.usecase';
import UserRegisterDto from './dto/user-register.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.decorator';
import { IUser } from './user.interface';
import { CreateUserUsecase } from './usecase/create.usecase';
import UserCreateDto from './dto/user-create.dto';
import { GetByIdUserUsecase } from './usecase/getById.usecase';
import { Types } from 'mongoose';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerUsecase: RegisterUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
    private readonly getByIdUserUsecase: GetByIdUserUsecase
  ) {}

  @Post('register')
  public async register(@Body() data: UserRegisterDto): Promise<any> {
    return this.registerUsecase.execute(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async create(
    @User() user: IUser,
    @Body() data: UserCreateDto
  ): Promise<any> {
    return this.createUserUsecase.execute(data,user);
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
    @Param('id') id: Types.ObjectId,
    @User() user: IUser
  ): Promise<IUser> {
    return this.getByIdUserUsecase.execute(id);
  }
  


}
