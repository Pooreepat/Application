import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PreferenceDocument = Preference & Document;

@Schema({ timestamps: true })
export class Preference {
  @Prop({ type: String, required: true })
  species: string;

  @Prop({ type: String, required: false })
  size?: string;

  @Prop({ type: Boolean, default: false })
  isSpayedOrNeutered: boolean;

  @Prop({ type: String, required: false })
  breed?: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: Boolean, default: true })
  isMale: boolean;

  @Prop({ type: [String], required: false, default: [] })
  vaccinationHistory?: string[];

  @Prop({ type: Date, required: false, default: 0 })
  minAge: number;

  @Prop({ type: Date, required: false, default: 2 })
  maxAge: number;

  _id?: Types.ObjectId;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
