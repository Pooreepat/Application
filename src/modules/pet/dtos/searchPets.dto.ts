import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export default class SearchPetDto {
  @ApiProperty({
    required: false,
    description: 'คำค้นหา ด้วยชื่อ หรือ รหัส',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ละติจูด',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'ละติจูดต้องเป็นตัวเลข',
    },
  )
  latitude: number;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ลองจิจูด',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'ลองจิจูดต้องเป็นตัวเลข',
    },
  )
  longitude: number;
}
