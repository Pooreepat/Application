import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterUsecase } from './usecase/register.usecase';
import { ProfileModule } from '../profile/profile.module';
import { CreateUserUsecase } from './usecase/create.usecase';

const usecases = [RegisterUsecase,CreateUserUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => ProfileModule),
  ],
  controllers: [UserController],
  providers: [UserService, ...usecases],
  exports: [UserService],
})
export class UserModule {}
