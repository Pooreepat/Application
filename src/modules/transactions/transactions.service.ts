import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './transactions.schema';
import { TransactionUpdateDto } from './dto/transactions-update.dto';

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
    const transactions = await this.transactionModel
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();
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
    updateTransactionDto: TransactionUpdateDto,
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
}
