import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSwipesDto {
  @ApiProperty({
    description: 'ID of the pet being swiped',
    required: true,
  })
  @IsNotEmpty()
  _petId: string;

  @ApiProperty({
    description: 'Indicates if the pet is liked',
    required: false,
  })
  @IsBoolean()
  isLiked: boolean;
}
