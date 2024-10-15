import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender, Species } from 'src/modules/pet/pet.constant';

export type PreferenceDocument = Preference & Document;

@Schema({ timestamps: true })
export class Preference {
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profileId: Types.ObjectId;

  @Prop({ type: String, enum: Species, required: true })
  species: Species;

  @Prop({ type: String, required: true })
  size: string;

  @Prop({ type: Boolean, default: false })
  isSpayedOrNeutered: boolean;

  @Prop({ required: true })
  breed: string;

  @Prop({ type: [String], required: true })
  generalHealth: string[];

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop({ type: [String], required: true })
  vaccinationHistory: string[];

  @Prop({ type: Date, required: true })
  minBirthdayAt: Date;

  @Prop({ type: Date, required: true })
  maxBirthdayAt: Date;

  _id?: Types.ObjectId;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);
