import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId } from 'class-validator';
import { SwipeType } from 'src/modules/swipes/swipes.constant';

export class MatchUpdateDto {
  @ApiProperty({
    example: '60b8d295f06020000808b0e0',
    description: 'รหัสผู้สไลด์',
  })
  @IsMongoId({ message: 'รหัสผู้สไลด์ต้องเป็น MongoID' })
  _swiperId?: string;

  @ApiProperty({
    example: '60b8d295f06020000808b0e1',
    description: 'รหัสสัตว์เลี้ยงที่ถูกสไลด์',
  })
  @IsMongoId({ message: 'รหัสสัตว์เลี้ยงที่ถูกสไลด์ต้องเป็น MongoID' })
  _swipedPetId?: string;

  @ApiProperty({
    example: 'LIKE',
    description: 'ประเภทการสไลด์',
    enum: SwipeType,
  })
  @IsEnum(SwipeType, { message: 'ประเภทการสไลด์ไม่ถูกต้อง' })
  swipeType?: SwipeType;
}
