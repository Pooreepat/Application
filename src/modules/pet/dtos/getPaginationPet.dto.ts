import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class GetPetPaginationDto {
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

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'คำค้นหาต้องเป็นตัวอักษร',
  })
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'รหัสเจ้าของต้องเป็นตัวเลข',
  })
  _ownerId?: string;
}
