import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferenceService } from './preference.service';
import { PreferenceController } from './preference.controller';
import { Preference, PreferenceSchema } from './preference.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Preference.name, schema: PreferenceSchema }])],
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferenceModule {}
