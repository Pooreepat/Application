import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, Max, Min } from 'class-validator';

export default class PetSearchDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'ละติจูด',
  })
  @IsOptional()
  @IsString({
    message: 'ละติจูดต้องเป็นตัวเลข',
  })
  latitude: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ลองจิจูด',
  })
  @IsOptional()
  @IsString({
    message: 'ลองจิจูดต้องเป็นตัวเลข',
  })
  longitude: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ระยะห่างสูงสุด',
  })
  @IsOptional()
  @IsString({
    message: 'ระยะห่างสูงสุดต้องเป็นตัวเลข',
  })
  maxDistance: number;

  @ApiProperty({
    required: false,
    enum: ['male', 'female', 'both'],
    description: 'สนใจเพศใด',
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'both'], {
    message: 'ค่าเพศที่สนใจต้องเป็น "male", "female" หรือ "both"',
  })
  gender: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'สนใจสายพันธุ์ใด',
  })
  @IsOptional()
  @IsString({
    message: 'สายพันธุ์ต้องเป็นสตริง',
  })
  specie: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'อายุขั้นต่ำ',
  })
  @IsOptional()
  @IsString({
    message: 'อายุขั้นต่ำต้องเป็นตัวเลข',
  })
  minAge: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'อายุสูงสุด',
  })
  @IsOptional()
  @IsString({
    message: 'อายุสูงสุดต้องเป็นตัวเลข',
  })
  maxAge: number;
}
