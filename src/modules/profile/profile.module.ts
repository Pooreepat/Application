import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { GetProfilePaginationUsecase } from './usecase/getPagination.usecase';

const usecases = [GetProfilePaginationUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ...usecases],
  exports: [ProfileService],
})
export class ProfileModule {}
