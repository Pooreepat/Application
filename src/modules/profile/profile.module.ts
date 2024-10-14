import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { GetProfilePaginationUsecase } from './usecase/getPagination.usecase';
import { UserModule } from '../user/user.module';
import { UpdateProfileUsecase } from './usecase/update.usecase';
import { GetByIdProfileUsecase } from './usecase/getById.usecase';
import { DeleteProfileUsecase } from './usecase/DeleteById.usecase copy';

const usecases = [
  GetProfilePaginationUsecase,
  UpdateProfileUsecase,
  GetByIdProfileUsecase,
  DeleteProfileUsecase
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ...usecases],
  exports: [ProfileService],
})
export class ProfileModule {}
