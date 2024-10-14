import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @ApiProperty({
    example: 'https://www.google.com',
    description: 'รูปภาพ',
    type: [String],
  })
  @IsNotEmpty({ message: 'รูปภาพห้ามว่าง' })
  @IsString({ each: true, message: 'รูปภาพต้องเป็น URL' })
  images: string[];
}
