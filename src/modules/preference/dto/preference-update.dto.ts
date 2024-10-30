import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Gender, Species } from 'src/modules/pet/pet.constant';

export class PreferenceUpdateDto {
  @ApiProperty({ example: 'Dog', description: 'ชนิดสัตว์' })
  @IsNotEmpty({ message: 'ชนิดสัตว์ห้ามว่าง' })
  @IsString({ message: 'ชนิดสัตว์ต้องเป็นสตริง' })
  species: Species;

  @ApiProperty({ example: 'Labrador', description: 'สายพันธุ์' })
  @IsNotEmpty({ message: 'สายพันธุ์ห้ามว่าง' })
  @IsString({ message: 'สายพันธุ์ต้องเป็นสตริง' })
  breed: string;

  @ApiProperty({ example: 'Large', description: 'ขนาด' })
  @IsNotEmpty({ message: 'ขนาดห้ามว่าง' })
  @IsString({ message: 'ขนาดต้องเป็นสตริง' })
  size: string;

  @ApiProperty({ example: ['Good Vision'], description: 'สุขภาพทั่วไป' })
  @IsArray({ message: 'สุขภาพทั่วไปต้องเป็นอาร์เรย์' })
  generalHealth: string[];

  @ApiProperty({ example: ['Friendly'], description: 'แท็ก' })
  @IsArray({ message: 'แท็กต้องเป็นอาร์เรย์' })
  tags: string[];

  @ApiProperty({ example: 'Male', description: 'เพศ', enum: Gender })
  @IsEnum(Gender, { message: 'เพศไม่ถูกต้อง' })
  gender: Gender;

  @ApiProperty({ example: '2020-01-01', description: 'วันเกิดต่ำสุด' })
  @IsNotEmpty({ message: 'วันเกิดต่ำสุดห้ามว่าง' })
  minBirthdayAt: Date;

  @ApiProperty({ example: '2022-01-01', description: 'วันเกิดสูงสุด' })
  @IsNotEmpty({ message: 'วันเกิดสูงสุดห้ามว่าง' })
  maxBirthdayAt: Date;

  @ApiProperty({ example: ['2020-01-01'], description: 'ประวัติการฉีดวัคซีน' })
  @IsArray({ message: 'ประวัติการฉีดวัคซีนต้องเป็นอาร์เรย์' })
  vaccinationHistory: string[];

  @ApiProperty({ example: true, description: 'ทำหมันแล้วหรือยัง' })
  @IsBoolean({ message: 'ทำหมันแล้วหรือยังต้องเป็นบูลีน' })
  isSpayedOrNeutered: boolean;
}
