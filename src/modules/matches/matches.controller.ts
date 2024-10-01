import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './matches.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MatchCreateDto } from './dto/matches-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createMatchDto: MatchCreateDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: MatchCreateDto) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.matchService.delete(id);
  }
}
