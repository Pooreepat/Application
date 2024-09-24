import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferenceController } from './preference.controller';
import { Preference, PreferenceSchema } from './preference.schema';
import { PreferenceService } from './preference.service';

const usecases = [];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Preference.name, schema: PreferenceSchema },
    ]),
  ],
  controllers: [PreferenceController],
  providers: [PreferenceService, ...usecases],
  exports: [PreferenceService],
})
export class ProfileModule {}
