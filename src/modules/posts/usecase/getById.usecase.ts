import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PostsService } from '../posts.service';
import GetPostsPaginationDto from '../dto/getPagination.dto';
import { Types } from 'mongoose';
import { IPosts } from '../posts.interface';

@Injectable()
export class GetByIdUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(data: { id: Types.ObjectId }): Promise<IPosts> {
    try {
      const post = this.postService.getPostById(new Types.ObjectId(data.id));

      if (!post) {
        throw new HttpException('Cannot get post', 500);
      }
      return post;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
