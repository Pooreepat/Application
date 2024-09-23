import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserRegisterDto from '../dto/user-register.dto';
import { UserService } from '../user.service';
import { HttpRespons } from 'src/interface/respones';

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {}

  public async execute(data: UserRegisterDto): Promise<HttpRespons> {
    try {
      const user = await this.userService.createUser(data);
      if (!user) {
        throw new HttpException('ไม่สามารถสร้างผู้ใช้งานได้', 500);
      }
      return {
        message: 'สร้างผู้ใช้งานสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
