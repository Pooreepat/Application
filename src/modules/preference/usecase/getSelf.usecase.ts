import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import { EUserRole } from 'src/modules/user/user.constant';
import { PreferenceService } from '../preference.service';
import { IUser } from 'src/modules/user/user.interface';
import { IProfile } from 'src/modules/profile/profile.interface';
import { IPreference } from '../preference.interface';

@Injectable()
export class GetSelfPreferenceUsecase {
  constructor(
    private readonly preferenceService: PreferenceService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    user: IUser & { profile: IProfile },
  ): Promise<IPreference[]> {
    try {
      return this.preferenceService.findByProfileId(
        user.profile._id,
      )
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
