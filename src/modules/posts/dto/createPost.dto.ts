import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from 'src/dto/location.dto';
import { Type } from 'class-transformer';
import { EStatusPosts } from '../posts.constant';

export class CreatePostsDto {
  @ApiProperty({
    description: 'Title of the Post',
    example: 'This is a post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the Post',
    example: 'This is a post',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Images of the pet',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Invalid image format' })
  @IsString({ each: true, message: 'Invalid image format' })
  images?: string[];

  @ApiProperty({
    description: 'Hidden status of the Post',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isHidden: boolean;

  @ApiProperty({
    description: 'Tags related to the Post',
    type: [String],
    example: ['help', 'urgent'],
  })
  @IsOptional()
  @IsArray({ message: 'Invalid tag format' })
  @IsString({ each: true, message: 'Invalid tag format' })
  tags: string[];

  @ApiProperty({
    description: 'Location of the pet with type and coordinates',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  location: {
    type: string;
    coordinates: number[];
  };

  @ApiProperty({
    required: false,
    enum: EStatusPosts,
    description: 'สถานะโพสต์',
  })
  @IsOptional()
  @IsEnum(EStatusPosts, {
    message: 'ค่าสถานะโพสต์ต้องเป็น seen_nearby, help_needed เท่านั้น',
  })
  status: EStatusPosts;
}
