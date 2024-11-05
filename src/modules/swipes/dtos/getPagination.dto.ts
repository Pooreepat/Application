import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class GetSwipePaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  page?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'จำนวนข้อมูลต่อหน้าต้องเป็นตัวเลข',
  })
  perPage?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'รหัสสัตว์เลี้ยงต้องเป็นตัวเลข',
  })
  _petId?: string;
}
