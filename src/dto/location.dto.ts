import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LocationDto {
  @ApiProperty({
    description: 'Location type, default is "Point"',
    example: 'Point',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Coordinates of the Pet location [longitude, latitude]',
    type: [Number],
    example: [100.523186, 13.736717],
  })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}
