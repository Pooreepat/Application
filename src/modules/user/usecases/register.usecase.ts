import { HttpException, Injectable } from '@nestjs/common';
import RegisterUserDto from '../dtos/registerUser.dto';
import { IUser } from '../interfaces/user.interface';
import { IProfile } from '../interfaces/profile.interface';
import { EUserRole } from '../constants/user.constant';
import { UserService } from '../user.service';

@Injectable()
export class RegisterUserUsecase {
  constructor(
    private readonly userService: UserService,
  ) {}

  public async execute(data: RegisterUserDto): Promise<IUser> {
    try {
      const userCreate = await this.userService.createUser({
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        identityCard: data.identityCard,
        profile: {
          firstname: data.firstName,
          lastname: data.lastName,
          birthdayAt: new Date(data.birthdayAt),
        } as IProfile,
        role: [EUserRole.USER],
      });

      if (!userCreate) {
        throw new HttpException('Cannot create user', 500);
      }

      return userCreate;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
