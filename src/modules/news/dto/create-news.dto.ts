import { IsString, IsNotEmpty, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ENewsType } from '../news.constant';

export class CreateNewsDto {
  @ApiProperty({ description: 'Title of the news' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the news' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Images of the Pet',
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({
    description: 'Type of the news',
    enum: ENewsType,
    example: ENewsType.VIRUS,
  })
  @IsNotEmpty()
  @IsEnum(ENewsType)
  type: ENewsType;
}
