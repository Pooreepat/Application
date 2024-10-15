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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PreferenceCreateDto } from './dto/preference-create.dto';
import { PreferenceUpdateDto } from './dto/preference-update.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PreferenceCreateUsecase } from './usecase/create.usecase';
import { User } from '../user/user.decorator';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';

@ApiTags('Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences')
export class PreferenceController {
  constructor(
    private readonly preferenceService: PreferenceService,
    private readonly preferenceCreateUsecase: PreferenceCreateUsecase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'สร้างการตั้งค่าใหม่' })
  @ApiResponse({ status: 201, description: 'การตั้งค่าถูกสร้างแล้ว' })
  create(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() createPreferenceDto: PreferenceCreateDto,
  ) {
    return this.preferenceCreateUsecase.execute({
      ...createPreferenceDto,
      id: user.profile._id,
    });
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
