import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetProfilePaginationDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'หน้าที่',
  })
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  page: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'จำนวนข้อมูลต่อหน้า',
  })
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  perPage: number;
}
