import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Gender } from '../pet.constant';
// nickname: string;
// gender: Gender;
// breed: string;
// location: string[];
// tags: string[];
// images: string[];
// generalHealth: string[];
// birthdayAt: Date;
// characteristics: string[];
// vaccinationHistory: string[];
// theme: Theme;
// isAlive: boolean;
// notes: string;
// size: string;
// energy: string;
// isHiddened: Boolean;
// status: Status;
export default class UpdatePetDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'ชื่อเล่น',
  })
  @IsOptional()
  @IsString({
    message: 'ชื่อเล่นต้องเป็นตัวอักษร',
  })
  nickname?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'เพศ',
  })
  @IsOptional()
  @IsEnum(Gender, {
    message: `เพศต้องเป็น ${Object.values(Gender).join(' หรือ ')}`,
  })
  gender: Gender;

  
  



  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'เบอร์โทรศัพท์',
  // })
  // @IsOptional()
  // @Length(10, 10, {
  //   message: 'เบอร์โทรศัพท์ต้องมี 10 ตัว',
  // })
  // phone?: string;

  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'รูปภาพ',
  // })
  // @IsOptional()
  // images?: string[];

  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'ชื่อ',
  // })
  // @IsOptional()
  // firstname?: string;

  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'นามสกุล',
  // })
  // @IsOptional()
  // lastname?: string;

  // @ApiProperty({
  //   required: false,
  //   type: Date,
  //   description: 'วันเกิด',
  // })
  // @IsOptional()
  // birthdayAt?: Date;

  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'ประเภทที่พัก',
  // })
  // @IsOptional()
  // @IsEnum(AccommodationType, {
  //   message: `ประเภทที่พักต้องเป็น ${Object.values(AccommodationType).join(' หรือ ')}`,
  // })
  // accommodationType?: AccommodationType;

  // @ApiProperty({
  //   required: false,
  //   type: Number,
  //   description: 'ระดับ',
  // })
  // @IsOptional()
  // @IsNumber(
  //   {},
  //   {
  //     message: 'ระดับต้องเป็นตัวเลข',
  //   },
  // )
  // level?: number;

  // @ApiProperty({
  //   required: false,
  //   type: Number,
  //   description: 'ระยะทาง',
  // })
  // @IsOptional()
  // @IsNumber(
  //   {},
  //   {
  //     message: 'ระยะทางต้องเป็นตัวเลข',
  //   },
  // )
  // distance?: number;

  // @ApiProperty({
  //   required: false,
  //   type: Number,
  //   description: 'เวลาว่าง',
  // })
  // @IsOptional()
  // @IsNumber(
  //   {},
  //   {
  //     message: 'เวลาว่างต้องเป็นตัวเลข',
  //   },
  // )
  // freeTime?: number;

  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'บุคลิกภาพ',
  // })
  // @IsOptional()
  // @IsArray({
  //   message: 'บุคลิกภาพต้องเป็น array',
  // })
  // personality?: string[];

  // @ApiProperty({
  //   required: false,
  //   type: String,
  //   description: 'รูปแบบการดำเนินชีวิต',
  // })
  // @IsOptional()
  // @IsString({
  //   message: 'รูปแบบการดำเนินชีวิตต้องเป็นตัวอักษร',
  // })
  // lifestyle?: string;
}
