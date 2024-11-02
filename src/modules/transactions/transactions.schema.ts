import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RandomNumber } from 'src/common/utils/randomNumber';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, collection: 'transaction' })
export class Transaction {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'match' })
  _matchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  _caretakerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  _adopterId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'pet' })
  _petId: Types.ObjectId;

  @Prop({ type: [String], required: false, default: [] })
  images?: string[];

  _id?: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
