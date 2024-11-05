import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PetService } from '../pet.service';
import { IPet } from '../pet.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import GetPetPaginationDto from '../dtos/getPaginationPet.dto';
import { Types } from 'mongoose';

@Injectable()
export class GetPaginationPetUsecase {
  constructor(private readonly petService: PetService) {}

  public async execute(
    data: GetPetPaginationDto,
    user: IUser,
  ): Promise<HttpResponsePagination<IPet>> {
    try {
      const page = Number(data.page || 1);
      const perPage = Number(data.perPage || 10);

      const filter = {};

      if (data.search) {
        filter['nickname'] = { $regex: data.search, $options: 'i' };
      }

      if (data._ownerId) {
        filter['$or'] = [
          { _caretakerId: new Types.ObjectId(data._ownerId) },
          { _adopterId: new Types.ObjectId(data._ownerId) },
        ];
      }

      const [pets, total] = await this.petService.getPagination(
        filter,
        page,
        perPage,
      );

      return {
        data: pets,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
