import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EUserRole } from '../constants/user.constant';

export default class GetUserPaginationDto {
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
  @IsEnum(EUserRole)
  role?: EUserRole;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'คำค้นหาต้องเป็นตัวอักษร',
  })
  search?: string;
}
