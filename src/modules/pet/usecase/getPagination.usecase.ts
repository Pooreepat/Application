import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpResponsePagination } from 'src/interface/respones';
import GetProfilePaginationDto from '../dto/getPagination.dto';
import { PetService } from '../pet.service';

@Injectable()
export class GetPetPaginationUsecase {
  constructor(
    private readonly petService: PetService,
    readonly configService: ConfigService,
  ) {}

  public async execute(
    data: GetProfilePaginationDto,
  ): Promise<HttpResponsePagination> {
    try {
      const page = Number(data.page) || 1;
      const perPage = Number(data.perPage) || 10;

      const skip = (page - 1) * perPage;
      const [pets, total] = await this.petService.getPagination(skip, perPage);
      if (!pets) {
        throw new HttpException('ไม่พบข้อมูล', 404);
      }
      return {
        data: pets,
        total,
        page,
        perPage,
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
