import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EStatusPosts } from '../posts.constant';

export default class GetPostsPaginationDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'หน้าที่',
  })
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  page: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'จำนวนข้อมูลต่อหน้า',
  })
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  perPage: string;

  @ApiProperty({
    required: false,
    enum: EStatusPosts,
    description: 'สถานะโพสต์',
  })
  @IsOptional()
  @IsEnum(EStatusPosts, {
    message:
      'ค่าสถานะโพสต์ต้องเป็น seen_nearby, help_needed เท่านั้น',
  })
  status: EStatusPosts;
}
