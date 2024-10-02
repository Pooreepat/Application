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
import { SwipeService } from './swipes.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SwipeCreateDto } from './dto/swipes-create.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSwipesUsecase } from './usecase/create.usecase';
import { ProfileTransformUserPipe } from '../profile/pipe/merchant-transform-user.pipe';
import { User } from '../user/user.decorator';
import { IUser } from '../user/user.interface';
import { IProfile } from '../profile/profile.interface';

@ApiTags('Swipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('swipes')
export class SwipeController {
  constructor(
    private readonly swipeService: SwipeService,
    private readonly createSwipesUsecase: CreateSwipesUsecase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'สร้างการสไลด์ใหม่' })
  @ApiResponse({ status: 201, description: 'การสไลด์ถูกสร้างแล้ว' })
  create(
    @User(ProfileTransformUserPipe) user: IUser & { profile: IProfile },
    @Body() createSwipeDto: SwipeCreateDto,
  ) {
    return this.createSwipesUsecase.execute({
      ...createSwipeDto,
      _swiperId: user.profile._id,
    });
  }

  // @Get()
  // @ApiOperation({ summary: 'ดึงข้อมูลการสไลด์ทั้งหมด' })
  // findAll() {
  //   return this.swipeService.findAll();
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'ดึงข้อมูลการสไลด์ตาม ID' })
  // findOne(@Param('id') id: string) {
  //   return this.swipeService.findOne(id);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'อัปเดตการสไลด์ตาม ID' })
  // update(@Param('id') id: string, @Body() updateSwipeDto: SwipeUpdateDto) {
  //   return this.swipeService.update(id, updateSwipeDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'ลบการสไลด์ตาม ID' })
  // remove(@Param('id') id: string) {
  //   return this.swipeService.remove(id);
  // }
}
