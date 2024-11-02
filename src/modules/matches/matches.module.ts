import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './matches.schema';
import { MatchService } from './matches.service';
import { MatchController } from './matches.controller';
import { GetPaginationMatchUsecase } from './usecases/getPaginationMatch.usecase';
import { GetMatchByIdUsecase } from './usecases/getMatchById.usecase';

const usecases = [
  GetPaginationMatchUsecase,
  GetMatchByIdUsecase
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
  ],
  controllers: [MatchController],
  providers: [MatchService, ...usecases],
  exports: [MatchService],
})
export class MatchModule {}
