import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateOfficerUsecase } from './usecases/createOfficer.usecase';
import { GetUserByIdUsecase } from './usecases/getUserById.usecase';
import { RegisterUserUsecase } from './usecases/register.usecase';
import { GetPaginationUserUsecase } from './usecases/getPaginationUser.usecase';
import { UpdateUserUsecase } from './usecases/update.usecase';

const usecases = [
  CreateOfficerUsecase,
  GetUserByIdUsecase,
  RegisterUserUsecase,
  GetPaginationUserUsecase,
  UpdateUserUsecase,
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, ...usecases],
  exports: [UserService],
})
export class UserModule {}
