import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TransactionStatus } from '../transactions.constant';

export class TransactionUpdateDto {
  @ApiProperty({ example: '12345', description: 'Unique Transaction Number' })
  _numberId?: string;

  @ApiProperty({ example: '60d6fe4d2ab79c6e541b4e2b', description: 'Match ID' })
  _matcheId?: Types.ObjectId;

  @ApiProperty({ example: 'PENDING', enum: TransactionStatus })
  status?: TransactionStatus;
}