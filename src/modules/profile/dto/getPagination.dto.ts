import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EUserRole } from 'src/modules/user/user.constant';

export default class GetProfilePaginationDto {
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

  @ApiProperty({
    required: false,
    type: EUserRole,
    description: 'บทบาท',
  })
  @IsNotEmpty()
  @IsEnum(EUserRole)
  role: EUserRole;
}
