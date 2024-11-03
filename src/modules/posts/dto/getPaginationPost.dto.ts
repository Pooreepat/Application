import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EStatusPosts } from '../posts.constant';

export default class GetPostsPaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  page?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  perPage?: string;

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
  status?: EStatusPosts;
}
