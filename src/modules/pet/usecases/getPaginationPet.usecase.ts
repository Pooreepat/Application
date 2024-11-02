import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PetService } from '../pet.service';
import { IPet } from '../pet.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import GetPetPaginationDto from '../dtos/getPaginationPet.dto';

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
          { _caretakerId: data._ownerId },
          { _adopterId: data._ownerId },
        ];
      }

      const [users, total] = await this.petService.getPagination(
        filter,
        page,
        perPage,
      );

      if (!users) {
        throw new HttpException('Cannot get user', 500);
      }

      return {
        data: users,
        total: total,
        page: page,
        perPage: perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
