import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Gender } from 'src/modules/pet/pet.constant';

export class PreferenceUpdateDto {
  @IsOptional()
  @IsString({ message: 'ชนิดสัตว์ต้องเป็นสตริง' })
  species?: string;

  @IsOptional()
  @IsString({ message: 'สายพันธุ์ต้องเป็นสตริง' })
  breed?: string;

  @IsOptional()
  @IsString({ message: 'ขนาดต้องเป็นสตริง' })
  size?: string;

  @IsOptional()
  @IsArray({ message: 'ลักษณะพิเศษต้องเป็นอาร์เรย์' })
  characteristics?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'พลังงานต้องเป็นตัวเลข' })
  @Min(0, { message: 'พลังงานต้องไม่น้อยกว่า 0' })
  @Max(100, { message: 'พลังงานต้องไม่เกิน 100' })
  energy?: number;

  @IsOptional()
  @IsArray({ message: 'สุขภาพทั่วไปต้องเป็นอาร์เรย์' })
  generalHealth?: string[];

  @IsOptional()
  @IsArray({ message: 'แท็กต้องเป็นอาร์เรย์' })
  tags?: string[];

  @IsOptional()
  @IsEnum(Gender, { message: 'เพศไม่ถูกต้อง' })
  gender?: Gender;

  @IsOptional()
  @IsArray({ message: 'วันเกิดต้องเป็นอาร์เรย์' })
  birthdayAt?: Date[];
}
