import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { TransactionService } from '../transactions.service';
import { ITransaction } from '../transactions.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';

@Injectable()
export class GetTransactionByIdUsecase {
  constructor(private readonly transactionService: TransactionService) {}

  public async execute(id: string, user: IUser): Promise<ITransaction> {
    try {
      const match = await this.transactionService.findTransactionById(
        new Types.ObjectId(id),
      );

      if (!match) {
        throw new HttpException('ไม่พบประวัติการทำรายการ', 404);
      }

      switch (user.role[0]) {
        case EUserRole.ADMIN:
          break;
        case EUserRole.AGENCY:
          if (
            !user._id.equals(match._adopterId) &&
            !user._id.equals(match._caretakerId)
          ) {
            throw new HttpException('ไม่มีสิทธิ์ในการดูข้อมูล', 403);
          }
          break;
        case EUserRole.USER:
          if (
            !user._id.equals(match._adopterId) &&
            !user._id.equals(match._caretakerId)
          ) {
            throw new HttpException('ไม่มีสิทธิ์ในการดูข้อมูล', 403);
          }
          break;
        default:
          throw new HttpException('ไม่มีสิทธิ์ในการดูข้อมูล', 403);
      }

      return match;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
