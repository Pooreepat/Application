import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PreferenceService } from './preference.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PreferenceCreateDto } from './dto/preference-create.dto';
import { PreferenceUpdateDto } from './dto/preference-update.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างการตั้งค่าใหม่' })
  @ApiResponse({ status: 201, description: 'การตั้งค่าถูกสร้างแล้ว' })
  create(@Body() createPreferenceDto: PreferenceCreateDto) {
    return this.preferenceService.create(createPreferenceDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลการตั้งค่าทั้งหมด' })
  findAll() {
    return this.preferenceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลการตั้งค่าตาม ID' })
  findOne(@Param('id') id: string) {
    return this.preferenceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'อัปเดตการตั้งค่าตาม ID' })
  update(
    @Param('id') id: string,
    @Body() updatePreferenceDto: PreferenceUpdateDto,
  ) {
    return this.preferenceService.update(id, updatePreferenceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบการตั้งค่าตาม ID' })
  remove(@Param('id') id: string) {
    return this.preferenceService.remove(id);
  }
}
