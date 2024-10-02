import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class GetMessagePaginationDto {

  @ApiProperty({
    required: false,
    type: String,
    description: 'รหัสการแมตช์',
  })
  @IsString({
    message: 'รหัสการแมตช์ต้องเป็น MongoID',
  })
  id: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'หน้าที่',
  })
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  page: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'จำนวนข้อมูลต่อหน้า',
  })
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  perPage: string;
}
