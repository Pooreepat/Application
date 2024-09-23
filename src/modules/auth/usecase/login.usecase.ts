import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import UserLoginDto from '../dto/user-login.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  public async execute(data: UserLoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.validateUserCredentials(data);
      if (!user) {
        throw new BadRequestException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
      return this.authService.generateToken(user);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
