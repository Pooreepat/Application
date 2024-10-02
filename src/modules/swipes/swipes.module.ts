import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwipeService } from './swipes.service';
import { SwipeController } from './swipes.controller';
import { Swipe, SwipeSchema } from './swipes.schema';
import { CreateSwipesUsecase } from './usecase/create.usecase';
import { ProfileModule } from '../profile/profile.module';
import { MatchModule } from '../matches/matches.module';

const usecases= [CreateSwipesUsecase]

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Swipe.name, schema: SwipeSchema }]),
    ProfileModule,
    MatchModule,
  ],
  controllers: [SwipeController],
  providers: [SwipeService, ...usecases],
  exports: [SwipeService],
})
export class SwipeModule {}
