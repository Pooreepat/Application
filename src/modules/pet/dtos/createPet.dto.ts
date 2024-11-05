import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from 'src/dto/location.dto';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({
    description: 'Nickname of the pet, between 4-100 characters',
  })
  @Length(1, 200, {
    message: 'The nickname must be between 1-200 characters',
  })
  nickname?: string;

  @ApiProperty({
    description: 'Indicates if the pet is male',
  })
  @IsBoolean()
  isMale: boolean;

  @ApiProperty({
    description: 'Breed of the pet (optional)',
  })
  @IsOptional()
  @IsString()
  breed?: string;

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
    description: 'Species of the pet',
  })
  @IsNotEmpty()
  @IsString()
  species: string;

  @ApiProperty({
    description: 'Tags related to the pet',
    type: [String],
  })
  @IsArray({ message: 'Invalid tag format' })
  @IsString({ each: true, message: 'Invalid tag format' })
  tags: string[];

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
    description: 'General health notes for the pet',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Invalid general health format' })
  @IsString({ each: true, message: 'Invalid general health format' })
  generalHealth?: string[];

  @ApiProperty({
    description: 'Birthday of the pet in date format',
  })
  @IsDateString(undefined, {
    message: 'Invalid date format',
  })
  birthdayAt: Date;

  @ApiProperty({
    description: 'Vaccination history of the pet',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Invalid vaccination history format' })
  @IsString({ each: true, message: 'Invalid vaccination history format' })
  vaccinationHistory?: string[];

  @ApiProperty({
    description: 'Theme associated with the pet (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({
    description: 'Notes about the pet (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Size of the pet (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    description: 'Indicates if the pet is hidden (optional)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isHiddened?: boolean;

  @ApiProperty({
    description: 'Indicates if the pet is spayed or neutered (optional)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSpayedOrNeutered?: boolean;
}
