import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MessageType } from './messages.constant';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'match', required: true })
  _matchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  _senderId: Types.ObjectId;

  @Prop({ type: String, enum: MessageType })
  type: MessageType;

  @Prop()
  message: string;

  @Prop([String])
  images: string[];

  @Prop()
  sticker: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
