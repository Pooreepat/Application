import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './matches.schema';
import { MatchService } from './matches.service';
import { MatchController } from './matches.controller';
import { AcceptMatchesUsecase } from './usecase/accept.usecase';
import { ProfileModule } from '../profile/profile.module';
import { GetMatchesPaginationUsecase } from './usecase/getPagination.usecase';

const usecases = [AcceptMatchesUsecase, GetMatchesPaginationUsecase];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    ProfileModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, ...usecases],
  exports: [MatchService],
})
export class MatchModule {}
