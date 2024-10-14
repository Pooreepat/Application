import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './transactions.schema';
import { ITransaction } from './transactions.interface';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  public async getPagination(
    filterQuery: any,
    skip: number,
    perPage: number,
  ): Promise<[TransactionDocument[], number]> {
    const transactions = await this.transactionModel.aggregate([
      { $match: filterQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: perPage },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile1Id',
          foreignField: '_id',
          as: 'profile1',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile2Id',
          foreignField: '_id',
          as: 'profile2',
        },
      },
      {
        $lookup: {
          from: 'pets',
          localField: '_petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      { $unwind: { path: '$profile1', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$profile2', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
    ]);
    const total = await this.transactionModel.countDocuments(filterQuery);
    return [transactions, total];
  }

  async create(
    createTransactionDto: Partial<TransactionDocument>,
  ): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`ธุรกรรม ID ${id} ไม่พบ`);
    }
    return transaction;
  }

  async update(
    id: Types.ObjectId,
    updateTransactionDto: Partial<TransactionDocument>,
  ): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    if (!transaction) {
      throw new NotFoundException(`ธุรกรรม ID ${id} ไม่พบ`);
    }
    return transaction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`ธุรกรรม ID ${id} ไม่พบ`);
    }
  }

  async getTransactionById(id: Types.ObjectId): Promise<ITransaction> {
    const transactions = await this.transactionModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      { $limit: 1 },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile1Id',
          foreignField: '_id',
          as: 'profile1',
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: '_profile2Id',
          foreignField: '_id',
          as: 'profile2',
        },
      },
      {
        $lookup: {
          from: 'pets',
          localField: '_petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      { $unwind: { path: '$profile1', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$profile2', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
    ]);
    return transactions[0];
  }
}
