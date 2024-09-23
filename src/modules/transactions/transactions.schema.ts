import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionStatus } from './transactions.constant';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, unique: true })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  _matcheId: Types.ObjectId;

  @Prop({ type: String, enum: TransactionStatus })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
