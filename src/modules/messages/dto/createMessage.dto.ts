import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { EMessageType } from '../messages.constant';

export class CreateMessageDto {
  @ApiProperty({ example: 'text', enum: EMessageType })
  @IsEnum(EMessageType, { message: 'type ต้องเป็นค่าที่ถูกต้อง' })
  type: EMessageType;

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
