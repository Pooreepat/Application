import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'This is a comment',
  })
  @IsNotEmpty()
  @IsString()
  text: string;
}
