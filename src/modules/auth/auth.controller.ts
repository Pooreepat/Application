import { Body, Controller, Post } from '@nestjs/common';
import { LoginUsecase } from './usecase/login.usecase';
import UserLoginDto from './dto/user-login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  @Post('login')
  public async login(
    @Body() data: UserLoginDto,
  ): Promise<{ access_token: string }> {
    return this.loginUsecase.execute(data);
  }
}
