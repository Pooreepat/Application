import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { IPreference } from 'src/modules/preference/preference.interface';

export default class PetSearchDto {
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

  @ApiProperty({
    required: false,
    type: Number,
    description: 'ระยะห่างสูงสุด',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'ระยะห่างสูงสุดต้องเป็นตัวเลข',
    },
  )
  maxDistance: number;

  @ApiProperty({
    required: false,
    description: 'ความชอบ',
  })
  @IsOptional()
  preferences: IPreference[];

  @ApiProperty({
    required: false,
    description: 'คำค้นหา',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
