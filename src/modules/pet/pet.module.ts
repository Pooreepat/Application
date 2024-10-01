import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { Pet, PetSchema } from './pet.schema';
import { GetPetPaginationUsecase } from './usecase/getPagination.usecase';
import { UpdatePetUsecase } from './usecase/update.usecase';
import { GetByIdPetUsecase } from './usecase/getById.usecase';
import { CreatePetUsecase } from './usecase/create.usecase';
import { ProfileModule } from '../profile/profile.module';
import { SwipeModule } from '../swipes/swipes.module';
import { SearchPetUsecase } from './usecase/search.usecase';

const usecases = [
  GetPetPaginationUsecase,
  UpdatePetUsecase,
  GetByIdPetUsecase,
  CreatePetUsecase,
  SearchPetUsecase
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    ProfileModule,
    SwipeModule
  ],
  controllers: [PetController],
  providers: [PetService, ...usecases],
  exports: [PetService],
})
export class PetModule {}
