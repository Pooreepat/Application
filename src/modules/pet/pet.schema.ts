import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RandomNumber } from 'src/common/utils/randomNumber';
import { EPetStatus } from './pet.constant';

export type PetDocument = Pet & Document;

@Schema({ 
  timestamps: true,
  collection: 'pet',
 })
export class Pet {
  @Prop({
    unique: true,
    default: () => RandomNumber.generateRandomNumber(14).toString(),
  })
  _numberId: string;

  @Prop({ type: Types.ObjectId, ref: 'user', required: true })
  _caretakerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user', required: false })
  _adopterId?: Types.ObjectId;

  @Prop({ type: String, required: false })
  nickname?: string;

  @Prop({ type: Boolean, default: true })
  isMale: boolean;

  @Prop({ type: String, required: false })
  breed?: string;

  @Prop({
    type: {
      type: String,
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ type: String, required: true })
  species: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: [String], required: false, default: [] })
  images?: string[];

  @Prop({ type: [String], required: false, default: [] })
  generalHealth?: string[];

  @Prop({ type: Date, required: false, default: new Date() })
  birthdayAt: Date;

  @Prop({ type: [String], required: false, default: [] })
  vaccinationHistory?: string[];

  @Prop({ type: String, required: false })
  theme?: string;

  @Prop({ type: Boolean, required: true, default: true })
  isAlive: boolean;

  @Prop({ type: String, required: false })
  notes?: string;

  @Prop({ type: String, required: false })
  size?: string;

  @Prop({ type: Boolean, default: false })
  isHiddened: Boolean;

  @Prop({ type: String, enum: EPetStatus, default: EPetStatus.UNADOPTED })
  status: EPetStatus;

  @Prop({ type: Boolean, default: false })
  isSpayedOrNeutered: boolean;

  _id?: Types.ObjectId;
}

export const PetSchema = SchemaFactory.createForClass(Pet);

PetSchema.index({ location: '2dsphere' });
