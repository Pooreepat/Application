import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { MessageType } from '../messages.constant';

export class MessageCreateDto {

  @ApiProperty({ example: 'text', enum: MessageType })
  @IsEnum(MessageType, { message: 'type ต้องเป็นค่าที่ถูกต้อง' })
  type: MessageType;

  @ApiProperty({ example: 'Hello world', description: 'Message content' })
  @IsString({ message: 'message ต้องเป็นข้อความ' })
  @IsOptional()
  message: string;

  @ApiProperty({ example: ['image1.png'], description: 'Images URLs' })
  @IsArray({ message: 'images ต้องเป็น array ของข้อความ' })
  @IsOptional()
  images: string[];

  @ApiProperty({ example: 'sticker1', description: 'Sticker identifier' })
  @IsOptional()
  sticker: string;
}
