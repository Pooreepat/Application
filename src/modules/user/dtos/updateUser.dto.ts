import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';
import { ProfileDocument } from '../schemas/profile.schema';

export default class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail(undefined, {
    message: 'Invalid email format',
  })
  email?: string;

  @ApiProperty()
  @IsOptional()
  @Length(10, 10, {
    message: 'The phone number must be 10 characters',
  })
  phone?: string;

  @ApiProperty()
  @IsOptional()
  profile?: ProfileDocument;
}
