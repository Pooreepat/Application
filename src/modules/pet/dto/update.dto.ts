import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Gender, Theme } from '../pet.constant';
import { LocationDto } from 'src/dto/location.dto';
import { Type } from 'class-transformer';

export default class UpdatePetDto {
  @ApiProperty({
    description: 'Nickname of the Pet',
    example: 'Fluffy',
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({
    description: 'Gender of the Pet',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Breed of the Pet',
    example: 'Golden Retriever',
  })
  @IsOptional()
  @IsString()
  breed?: string;

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
    description: 'Species of the Pet',
    example: 'Dog',
  })
  @IsNotEmpty()
  @IsString()
  species: string;

  @ApiProperty({
    description: 'Tags related to the Pet',
    type: [String],
    example: ['friendly', 'playful'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

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
    description: 'General Health Conditions',
    type: [String],
    example: ['Healthy', 'Neutered'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  generalHealth: string[];

  @ApiProperty({
    description: 'Birthday of the Pet',
    example: '2020-06-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  birthdayAt: Date;

  @ApiProperty({
    description: 'Characteristics of the Pet',
    type: [String],
    example: ['Energetic', 'Loyal'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];

  @ApiProperty({
    description: 'Vaccination History of the Pet',
    type: [String],
    example: ['Rabies', 'Distemper'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  vaccinationHistory: string[];

  @ApiProperty({
    description: 'Theme for the Pet Profile',
    enum: Theme,
    example: Theme.BLUE,
  })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @ApiProperty({
    description: 'Indicates if the Pet is alive',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;

  @ApiProperty({
    description: 'Additional Notes for the Pet',
    example: 'Loves to play with toys.',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Size of the Pet',
    example: 'Medium',
  })
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty({
    description: 'Energy level of the Pet',
    example: 'High',
  })
  @IsNotEmpty()
  @IsString()
  energy: string;
}
