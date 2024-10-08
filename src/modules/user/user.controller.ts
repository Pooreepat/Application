import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterUsecase } from './usecase/register.usecase';
import UserRegisterDto from './dto/user-register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from './user.decorator';
import { IUser } from './user.interface';
import { CreateUserUsecase } from './usecase/create.usecase';
import UserCreateDto from './dto/user-create.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerUsecase: RegisterUsecase,
    private readonly createUserUsecase: CreateUserUsecase,
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
}
