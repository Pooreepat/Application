import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transactions.schema';
import { TransactionCreateDto } from './dto/transactions-create.dto';
import { TransactionUpdateDto } from './dto/transactions-update.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createTransactionDto: TransactionCreateDto): Promise<Transaction> {
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

  async update(id: string, updateTransactionDto: TransactionUpdateDto): Promise<Transaction> {
    const transaction = await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true }).exec();
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
