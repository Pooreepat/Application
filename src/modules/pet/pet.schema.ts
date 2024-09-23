import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender, Status, Theme } from './pet.constant';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true, unique: true })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  _profileId: Types.ObjectId;

  @Prop({ required: true })
  nickname: string;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  breed: string;

  @Prop([String])
  location: string[];

  @Prop({ required: true })
  species: string;

  @Prop([String])
  tags: string[];

  @Prop([String])
  images: string[];

  @Prop([String])
  generalHealth: string[];

  @Prop({ required: true })
  birthdayAt: Date;

  @Prop([String])
  characteristics: string[];

  @Prop([String])
  vaccinationHistory: string[];

  @Prop()
  identityCard: string;

  @Prop({ type: String, enum: Theme })
  theme: Theme;

  @Prop({ default: true })
  isAlive: boolean;

  @Prop()
  notes: string;

  @Prop({ required: true })
  size: string;

  @Prop()
  energy: string;

  @Prop()
  isHiddened: string;

  @Prop({ type: String, enum: Status })
  status: Status;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
