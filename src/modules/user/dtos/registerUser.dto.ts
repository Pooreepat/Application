import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, Length } from 'class-validator';

export default class RegisterUserDto {
  @ApiProperty()
  @Length(4, 100, {
    message: 'The username must be between 4-100 characters',
  })
  username: string;

  @ApiProperty()
  @Length(8, 100, {
    message: 'The password must be between 8-100 characters',
  })
  password: string;

  @ApiProperty()
  @IsEmail(undefined, {
    message: 'Invalid email format',
  })
  email: string;

  @ApiProperty()
  @Length(10, 10, {
    message: 'The phone number must be 10 characters',
  })
  phone: string;

  @ApiProperty()
  @Length(2, 100, {
    message: 'The first name must be between 2-100 characters',
  })
  firstName: string;

  @ApiProperty()
  @Length(2, 100, {
    message: 'The last name must be between 2-100 characters',
  })
  lastName: string;

  @ApiProperty()
  @IsDateString(undefined, {
    message: 'Invalid date format',
  })
  birthdayAt: string;

  @ApiProperty()
  @Length(13, 13, {
    message: 'The identity card must be 13 characters',
  })
  identityCard: string;
}
