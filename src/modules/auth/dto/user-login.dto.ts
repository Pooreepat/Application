import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export default class UserLoginDto {
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
}
