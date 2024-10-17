import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserRegisterDto from '../dto/user-register.dto';
import { UserService } from '../user.service';
import { HttpRespons } from 'src/interface/respones';
import { ProfileService } from 'src/modules/profile/profile.service';

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {}

  public async execute(data: UserRegisterDto): Promise<HttpRespons> {
    try {
      const user = await this.userService.registerUser(data);

      if (!user) {
        throw new HttpException('ไม่สามารถสร้างผู้ใช้งานได้', 500);
      }

      const profile = await this.profileService.createProfile({
        _userId: user._id,
        phone: data.phone,
        firstname: data.firstName,
        lastname: data.lastName,
        birthdayAt: new Date(data.birthDate),
        identityCard: data.identityCard,
      });

      if (!profile) {
        throw new HttpException('ไม่สามารถสร้างโปรไฟล์ได้', 500);
      }

      return {
        message: 'สร้างผู้ใช้งานสำเร็จ',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
