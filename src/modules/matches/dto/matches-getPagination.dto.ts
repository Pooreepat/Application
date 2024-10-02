import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export default class GetMatchesPaginationDto {
  @ApiProperty({
    required: false,
    enum: ['accepted', 'unmatched', 'both'],
    description: 'สนใจเพศใด',
  })
  @IsOptional()
  @IsEnum(['accepted', 'unmatched', 'both'], {
    message: 'ค่าเพศที่สนใจต้องเป็น accepted, unmatched, both เท่านั้น',
  })
  status: string;

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
}
