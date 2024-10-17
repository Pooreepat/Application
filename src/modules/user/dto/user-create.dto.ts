import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export default class UserCreateDto {
  @ApiProperty()
  @Length(4, 100, {
    message: 'ชื่อต้องมีความยาวระหว่าง 4-100 ตัวอักษร',
  })
  username: string;

  @ApiProperty()
  @Length(8, 100, {
    message: 'รหัสผ่านต้องมีความยาวระหว่าง 8-100 ตัวอักษร',
  })
  password: string;

  @ApiProperty()
  @IsEmail(undefined, {
    message: 'กรุณากรอกอีเมลให้ถูกต้อง',
  })
  email: string;

  @ApiProperty()
  @Length(10, 10, {
    message: 'เบอร์โทรศัพท์ต้องมี 10 ตัวเลข',
  })
  phone: string;

  @ApiProperty()
  @Length(2, 100, {
    message: 'ชื่อต้องมีความยาวระหว่าง 2-100 ตัวอักษร',
  })
  firstName: string;

  @ApiProperty()
  @Length(2, 100, {
    message: 'นามสกุลต้องมีความยาวระหว่าง 2-100 ตัวอักษร',
  })
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'กรุณากรอกวันเกิด',
  })
  birthDate: string;

  @ApiProperty({
    description: 'Images of the Pet',
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'กรุณากรอกเลขบัตรประชาชน',
  })
  identityCard: string;
}
