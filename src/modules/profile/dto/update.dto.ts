import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { AccommodationType } from '../profile.constant';

export default class UpdateProfileDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'เบอร์โทรศัพท์',
  })
  @IsOptional()
  @Length(10, 10, {
    message: 'เบอร์โทรศัพท์ต้องมี 10 ตัว',
  })
  phone?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'รูปภาพ',
  })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    required: false,
    type: String,
    description: 'ชื่อ',
  })
  @IsOptional()
  firstname?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'นามสกุล',
  })
  @IsOptional()
  lastname?: string;

  @ApiProperty({
    description: 'Birthday of the Pet',
    example: '2020-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  birthdayAt: Date;

  @ApiProperty({
    required: false,
    type: String,
    description: 'ประเภทที่พัก',
  })
  @IsOptional()
  @IsEnum(AccommodationType, {
    message: `ประเภทที่พักต้องเป็น ${Object.values(AccommodationType).join(' หรือ ')}`,
  })
  accommodationType?: AccommodationType;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ระดับ',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'ระดับต้องเป็นตัวเลข',
    },
  )
  level?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ระยะทาง',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'ระยะทางต้องเป็นตัวเลข',
    },
  )
  distance?: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'เวลาว่าง',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'เวลาว่างต้องเป็นตัวเลข',
    },
  )
  freeTime?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'บุคลิกภาพ',
  })
  @IsOptional()
  @IsArray({
    message: 'บุคลิกภาพต้องเป็น array',
  })
  personality?: string[];

  @ApiProperty({
    required: false,
    type: String,
    description: 'รูปแบบการดำเนินชีวิต',
  })
  @IsOptional()
  @IsString({
    message: 'รูปแบบการดำเนินชีวิตต้องเป็นตัวอักษร',
  })
  lifestyle?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'อีเมล',
  })
  @IsOptional()
  @IsString({
    message: 'อีเมลต้องเป็นตัวอักษร',
  })
  email?: string;
}
