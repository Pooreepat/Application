import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { IUser } from './interfaces/user.interface';
import UserLoginDto from '../auth/dto/user-login.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getUserById(userId: Types.ObjectId): Promise<IUser> {
    return this.userModel.findById(userId).lean();
  }

  public async getPagination(
    filterQuery: any,
    page: number,
    perPage: number,
  ): Promise<[UserDocument[], number]> {
    const data = await this.userModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
    const total = await this.userModel.countDocuments(filterQuery);
    return [data, total];
  }

  public async createUser(data: Partial<IUser>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  public async updateUser(
    userId: Types.ObjectId,
    data: Partial<IUser>,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userId, data, { new: true }).lean();
  }

  public async deleteUser(userId: Types.ObjectId): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(userId).lean();
  }

  public async validateUserCredentials(data: UserLoginDto): Promise<User> {
    try {
      const { username, password } = data;
      const user = await this.userModel
        .findOne({ username })
        .select('+password')
        .exec();
      if (!user) {
        throw new Error('user or password is incorrect');
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error('user or password is incorrect');
      }
      delete user.password;

      return user.toObject();
    } catch (e) {
      throw new MongooseError(e);
    }
  }
}
