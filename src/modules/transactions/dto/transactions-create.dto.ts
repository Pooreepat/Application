import { IsEnum, IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../transactions.constant';

export class TransactionCreateDto {
  @ApiProperty({
    example: '60b8d295f06020000808b0e0',
    description: 'รหัสแมทช์',
  })
  @IsNotEmpty({ message: 'รหัสแมทช์ห้ามว่าง' })
  @IsMongoId({ message: 'รหัสแมทช์ต้องเป็น MongoID' })
  _matcheId: string;

  @ApiProperty({
    example: 'PENDING',
    description: 'สถานะธุรกรรม',
    enum: TransactionStatus,
  })
  @IsEnum(TransactionStatus, { message: 'สถานะธุรกรรมไม่ถูกต้อง' })
  status: TransactionStatus;
}
