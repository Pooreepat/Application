import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Title of the news',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the news',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Images of the news',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Invalid image format' })
  @IsString({ each: true, message: 'Invalid image format' })
  images?: string[];

  @ApiProperty({
    description: 'Tags related to the news',
    type: [String],
  })
  @IsArray({ message: 'Invalid tag format' })
  @IsString({ each: true, message: 'Invalid tag format' })
  tags: string[];

  @ApiProperty({
    description: 'Type of the news',
  })
  @IsNotEmpty()
  @IsString()
  type: string;
}
