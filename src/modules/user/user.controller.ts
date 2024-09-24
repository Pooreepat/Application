import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterUsecase } from './usecase/register.usecase';
import UserRegisterDto from './dto/user-register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.decorator';
import { IUser } from './user.interface';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly registerUsecase: RegisterUsecase) {}

  @Post('register')
  public async register(@Body() data: UserRegisterDto): Promise<any> {
    return this.registerUsecase.execute(data);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async profile(@User() user: IUser): Promise<IUser> {
    return user;
  }
}
