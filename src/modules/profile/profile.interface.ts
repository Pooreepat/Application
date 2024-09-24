import { Types } from 'mongoose';
import { ProfileDocument } from './profile.schema';

export interface IProfile extends ProfileDocument {}

export interface IProfileCreate {
  _userId: Types.ObjectId;
  phone: string;
  firstname: string;
  lastname: string;
  birthdayAt: Date;
}
