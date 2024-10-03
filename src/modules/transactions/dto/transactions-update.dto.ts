import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../transactions.constant';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class TransactionUpdateDto {
  @ApiProperty({
    example: 'PENDING',
    description: 'สถานะธุรกรรม',
    enum: TransactionStatus,
  })
  @IsEnum(TransactionStatus, { message: 'สถานะธุรกรรมไม่ถูกต้อง' })
  status: TransactionStatus;
}
