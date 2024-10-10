import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionStatus } from './transactions.constant';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  _matchId: Types.ObjectId;

  @Prop({ type: String, enum: TransactionStatus })
  status: TransactionStatus;

  _id?: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
