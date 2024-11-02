import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import CreateOfficerDto from '../dtos/createOfficer.dto';
import { EUserRole } from '../constants/user.constant';
import { IUser } from '../interfaces/user.interface';
import { IProfile } from '../interfaces/profile.interface';

@Injectable()
export class CreateOfficerUsecase {
  constructor(private readonly userService: UserService) {}

  public async execute(data: CreateOfficerDto, user: IUser): Promise<IUser> {
    try {
      switch (user.role[0]) {
        case EUserRole.ADMIN:
          break;
        default:
          throw new HttpException('You do not have permission', 403);
      }

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
          images: data.images,
        } as IProfile,
        role: [EUserRole.AGENCY],
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
