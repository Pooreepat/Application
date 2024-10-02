import { IsEnum, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SwipeType } from '../swipes.constant';
import { Types } from 'mongoose';

export class SwipeCreateDto {
  @ApiProperty({ example: '60b8d295f06020000808b0e1', description: 'รหัสสัตว์เลี้ยงที่ถูกสไลด์' })
  @IsNotEmpty({ message: 'รหัสสัตว์เลี้ยงที่ถูกสไลด์ห้ามว่าง' })
  @IsMongoId({ message: 'รหัสสัตว์เลี้ยงที่ถูกสไลด์ต้องเป็น MongoID' })
  _swipedPetId: Types.ObjectId;

  @ApiProperty({ example: '60b8d295f06020000808b0e1', description: 'รหัสผู้สไลด์' })
  @IsNotEmpty({ message: 'รหัสผู้สไลด์ห้ามว่าง' })
  @IsMongoId({ message: 'รหัสผู้สไลด์ต้องเป็น MongoID' })
  _swipedId: Types.ObjectId;

  @ApiProperty({ example: 'LIKE', description: 'ประเภทการสไลด์', enum: SwipeType })
  @IsEnum(SwipeType, { message: 'ประเภทการสไลด์ไม่ถูกต้อง' })
  swipeType: SwipeType;
}