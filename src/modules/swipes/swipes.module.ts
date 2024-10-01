import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwipeService } from './swipes.service';
import { SwipeController } from './swipes.controller';
import { Swipe, SwipeSchema } from './swipes.schema';
import { CreateSwipesUsecase } from './usecase/create.usecase';
import { ProfileModule } from '../profile/profile.module';
import { AcceptSwipesUsecase } from './usecase/accept.usecase';

const usecases= [CreateSwipesUsecase,AcceptSwipesUsecase]

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Swipe.name, schema: SwipeSchema }]),
    ProfileModule,
  ],
  controllers: [SwipeController],
  providers: [SwipeService, ...usecases],
  exports: [SwipeService],
})
export class SwipeModule {}
