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
    description: 'Content of the Post',
    example: 'This is a post',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Images of the Post',
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Location of the Pet',
    type: LocationDto,
    example: {
      type: 'Point',
      coordinates: [100.523186, 13.736717],
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    required: false,
    enum: EStatusPosts,
    description: 'สถานะโพสต์',
  })
  @IsOptional()
  @IsEnum(EStatusPosts, {
    message:
      'ค่าสถานะโพสต์ต้องเป็น seen_nearby, help_needed เท่านั้น',
  })
  status: EStatusPosts;
}
