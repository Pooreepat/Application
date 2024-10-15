import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { Preference, PreferenceSchema } from './preference.schema';
import { PreferenceCreateUsecase } from './usecase/create.usecase';
import { ProfileModule } from '../profile/profile.module';
import { GetSelfPreferenceUsecase } from './usecase/getSelf.usecase';
import { UpdatePreferenceUsecase } from './usecase/update.usecase';

const usecases = [PreferenceCreateUsecase,GetSelfPreferenceUsecase,UpdatePreferenceUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Preference.name, schema: PreferenceSchema },
    ]),
    ProfileModule,
  ],
  controllers: [PreferenceController],
  providers: [PreferenceService, ...usecases],
})
export class PreferenceModule {}
