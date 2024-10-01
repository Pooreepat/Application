import { IsEnum, IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '../transactions.constant';

export class TransactionCreateDto {
  @ApiProperty({ example: 'T12345', description: 'รหัสธุรกรรม' })
  @IsNotEmpty({ message: 'รหัสธุรกรรมห้ามว่าง' })
  @IsString({ message: 'รหัสธุรกรรมต้องเป็นสตริง' })
  _numberId: string;

  @ApiProperty({ example: '60b8d295f06020000808b0e0', description: 'รหัสแมทช์' })
  @IsNotEmpty({ message: 'รหัสแมทช์ห้ามว่าง' })
  @IsMongoId({ message: 'รหัสแมทช์ต้องเป็น MongoID' })
  _matcheId: string;

  @ApiProperty({ example: 'PENDING', description: 'สถานะธุรกรรม', enum: TransactionStatus })
  @IsEnum(TransactionStatus, { message: 'สถานะธุรกรรมไม่ถูกต้อง' })
  status: TransactionStatus;
}

export class UpdateTransactionDto {
  @ApiProperty({ example: 'T12345', description: 'รหัสธุรกรรม' })
  @IsString({ message: 'รหัสธุรกรรมต้องเป็นสตริง' })
  _numberId?: string;

  @ApiProperty({ example: '60b8d295f06020000808b0e0', description: 'รหัสแมทช์' })
  @IsMongoId({ message: 'รหัสแมทช์ต้องเป็น MongoID' })
  _matcheId?: string;

  @ApiProperty({ example: 'PENDING', description: 'สถานะธุรกรรม', enum: TransactionStatus })
  @IsEnum(TransactionStatus, { message: 'สถานะธุรกรรมไม่ถูกต้อง' })
  status?: TransactionStatus;
}
