import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwipeService } from './swipes.service';
import { SwipeController } from './swipes.controller';
import { Swipe, SwipeSchema } from './swipes.schema';
import { CreateSwipesUsecase } from './usecases/createSwipes.usecase';
import { GetPaginationSwipeUsecase } from './usecases/getPaginationSwipe.usecase';
import { PetModule } from '../pet/pet.module';
import { ActionSwipesUsecase } from './usecases/actionSwipes.usecase';
import { MatchModule } from '../matches/matches.module';

const usecases = [CreateSwipesUsecase, GetPaginationSwipeUsecase,ActionSwipesUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Swipe.name, schema: SwipeSchema }]),
    forwardRef(() => PetModule),
    forwardRef(() => MatchModule)
  ],
  controllers: [SwipeController],
  providers: [SwipeService, ...usecases],
  exports: [SwipeService],
})
export class SwipeModule {}
