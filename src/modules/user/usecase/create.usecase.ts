import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserRegisterDto from '../dto/user-register.dto';
import { UserService } from '../user.service';
import { HttpRespons } from 'src/interface/respones';
import { ProfileService } from 'src/modules/profile/profile.service';
import { IUser } from '../user.interface';
import { EUserRole } from '../user.constant';
import UserCreateDto from '../dto/user-create.dto';

@Injectable()
export class CreateUserUsecase {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: UserCreateDto,
    user: IUser,
  ): Promise<HttpRespons> {
    try {
      const userCreate = await this.userService.createUser({
        ...data,
        role: [EUserRole.AGENCY],
      });

      if (!userCreate) {
        throw new HttpException('ไม่สามารถสร้างผู้ใช้งานได้', 500);
      }

      const profile = await this.profileService.createProfile({
        _userId: userCreate._id,
        phone: data.phone,
        firstname: data.firstName,
        lastname: data.lastName,
        images: data.images,
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
