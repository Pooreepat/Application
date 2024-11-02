import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from 'src/dto/location.dto';
import { Type } from 'class-transformer';

export class UpdatePetDto {
  @ApiProperty({
    description: 'Nickname of the pet, between 4-100 characters',
  })
  @IsOptional()
  @Length(4, 100, {
    message: 'The nickname must be between 4-100 characters',
  })
  nickname?: string;

  @ApiProperty({
    description: 'Location of the pet with type and coordinates',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: {
    type: string;
    coordinates: number[];
  };

  @ApiProperty({
    description: 'Tags related to the pet',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Invalid tag format' })
  @IsString({ each: true, message: 'Invalid tag format' })
  tags?: string[];

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

  @ApiProperty({
    description: 'Indicates if the pet is alive',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;
}
