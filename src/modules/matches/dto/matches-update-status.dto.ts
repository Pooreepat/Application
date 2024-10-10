import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MatchStatus } from '../matches.constant';

export class MatchUpdateStatusDto {
  @ApiProperty({
    example: 'accepted',
    description: 'ประเภทการเปลี่ยนแปลงสถานะ',
    enum: MatchStatus,
  })
  @IsEnum(MatchStatus, { message: 'ประเภทการเปลี่ยนแปลงสถานะไม่ถูกต้อง' })
  swipeType: MatchStatus;
}
