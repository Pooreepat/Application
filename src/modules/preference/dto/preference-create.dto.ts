import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { Gender } from "src/modules/pet/pet.constant";

export class PreferenceCreateDto {
  @ApiProperty({ example: '60b8d295f06020000808b0e0', description: 'รหัสโปรไฟล์' })
  @IsNotEmpty({ message: 'รหัสโปรไฟล์ห้ามว่าง' })
  _profileId: string;

  @ApiProperty({ example: 'Dog', description: 'ชนิดสัตว์' })
  @IsNotEmpty({ message: 'ชนิดสัตว์ห้ามว่าง' })
  @IsString({ message: 'ชนิดสัตว์ต้องเป็นสตริง' })
  species: string;

  @ApiProperty({ example: 'Labrador', description: 'สายพันธุ์' })
  @IsNotEmpty({ message: 'สายพันธุ์ห้ามว่าง' })
  @IsString({ message: 'สายพันธุ์ต้องเป็นสตริง' })
  breed: string;

  @ApiProperty({ example: 'Large', description: 'ขนาด' })
  @IsNotEmpty({ message: 'ขนาดห้ามว่าง' })
  @IsString({ message: 'ขนาดต้องเป็นสตริง' })
  size: string;

  @ApiProperty({ example: ['Friendly', 'Active'], description: 'ลักษณะพิเศษ' })
  @IsArray({ message: 'ลักษณะพิเศษต้องเป็นอาร์เรย์' })
  characteristics: string[];

  @ApiProperty({ example: 80, description: 'ระดับพลังงาน', minimum: 0, maximum: 100 })
  @IsNumber({}, { message: 'พลังงานต้องเป็นตัวเลข' })
  @Min(0, { message: 'พลังงานต้องไม่น้อยกว่า 0' })
  @Max(100, { message: 'พลังงานต้องไม่เกิน 100' })
  energy: number;

  @ApiProperty({ example: ['Good Vision'], description: 'สุขภาพทั่วไป' })
  @IsArray({ message: 'สุขภาพทั่วไปต้องเป็นอาร์เรย์' })
  generalHealth: string[];

  @ApiProperty({ example: ['Friendly'], description: 'แท็ก' })
  @IsArray({ message: 'แท็กต้องเป็นอาร์เรย์' })
  tags: string[];

  @ApiProperty({ example: 'Male', description: 'เพศ', enum: Gender })
  @IsEnum(Gender, { message: 'เพศไม่ถูกต้อง' })
  gender: Gender;

  @ApiProperty({ example: ['2020-01-01'], description: 'วันเกิด' })
  @IsArray({ message: 'วันเกิดต้องเป็นอาร์เรย์' })
  birthdayAt: Date[];
}