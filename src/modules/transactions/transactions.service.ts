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
    page: number,
    perPage: number,
  ): Promise<[TransactionDocument[], number]> {
    const data = await this.transactionModel
      .aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: 'user',
            localField: '_caretakerId',
            foreignField: '_id',
            as: 'caretaker',
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: '_adopterId',
            foreignField: '_id',
            as: 'adopter',
          },
        },
        {
          $lookup: {
            from: 'pet',
            localField: '_petId',
            foreignField: '_id',
            as: 'pet',
          },
        },
        { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$adopter', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ])
      .exec();
    const total = await this.transactionModel.countDocuments(filterQuery);
    return [data, total];
  }

  async createTransaction(data: Partial<TransactionDocument>): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(data);
    return createdTransaction.save();
  }

  async findTransactionById(id: Types.ObjectId): Promise<ITransaction> {
    const transaction = await this.transactionModel.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'user',
          localField: '_caretakerId',
          foreignField: '_id',
          as: 'caretaker',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: '_adopterId',
          foreignField: '_id',
          as: 'adopter',
        },
      },
      {
        $lookup: {
          from: 'pet',
          localField: '_petId',
          foreignField: '_id',
          as: 'pet',
        },
      },
      { $unwind: { path: '$caretaker', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$adopter', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$pet', preserveNullAndEmptyArrays: true } },
      { $limit: 1 },
    ]);
    return transaction[0];
  }
}
