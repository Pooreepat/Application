import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MatchStatus } from '../matches.constant';

export class MatchCreateDto {
  @ApiProperty({ example: '12345', description: 'Unique Match Number ID' })
  @IsNotEmpty({ message: 'ต้องระบุหมายเลขการแข่งขัน' })
  _numberId: string;

  @ApiProperty({
    example: '60bdf8a0f5d64845b8f41a23',
    description: 'Profile 1 ID',
  })
  @IsNotEmpty({ message: 'ต้องระบุ profile1Id' })
  _profile1Id: string;

  @ApiProperty({
    example: '60bdf8a0f5d64845b8f41a25',
    description: 'Profile 2 ID',
  })
  @IsNotEmpty({ message: 'ต้องระบุ profile2Id' })
  _profile2Id: string;

  @ApiProperty({ example: '60bdf8a0f5d64845b8f41a27', description: 'Pet ID' })
  @IsOptional()
  _petId: string;

  @ApiProperty({ example: 'pending', enum: MatchStatus })
  @IsEnum(MatchStatus, { message: 'สถานะต้องเป็นค่าที่ถูกต้อง' })
  @IsOptional()
  status: MatchStatus;
}
