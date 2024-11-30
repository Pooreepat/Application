import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { Pet, PetSchema } from './pet.schema';
import { UpdatePetUsecase } from './usecases/update.usecase';
import { GetPetByIdUsecase } from './usecases/getPetById.usecase';
import { GetPaginationPetUsecase } from './usecases/getPaginationPet.usecase';
import { CreatePetUsecase } from './usecases/createPet.usecase';
import { SearchPetsUsecase } from './usecases/searchPets.usecase';
import { SwipeModule } from '../swipes/swipes.module';
import { GetPetByFaceIdUsecase } from './usecases/getPetByFaceId.usecase';

const usecases = [
  UpdatePetUsecase,
  GetPetByIdUsecase,
  GetPaginationPetUsecase,
  CreatePetUsecase,
  SearchPetsUsecase,
  GetPetByFaceIdUsecase
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    forwardRef(() => SwipeModule)
  ],
  controllers: [PetController],
  providers: [PetService, ...usecases],
  exports: [PetService],
})
export class PetModule {}
