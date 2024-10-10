import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './matches.schema';
import { MatchService } from './matches.service';
import { MatchController } from './matches.controller';
import { UpdateStatusMatchUsecase } from './usecase/update-status.usecase';
import { ProfileModule } from '../profile/profile.module';
import { GetMatchesPaginationUsecase } from './usecase/getPagination.usecase';
import { GetByIdMatchUsecase } from './usecase/getById.usecase';

const usecases = [
  UpdateStatusMatchUsecase,
  GetMatchesPaginationUsecase,
  GetByIdMatchUsecase,
];

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
