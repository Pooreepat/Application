import { HttpException, Injectable } from '@nestjs/common';
import { HttpResponsePagination } from 'src/interface/respones';
import { PostsService } from '../posts.service';
import GetPostsPaginationDto from '../dto/getPaginationPost.dto';
import { Types } from 'mongoose';
import { IPost } from '../posts.interface';
import { IUser } from 'src/modules/user/interfaces/user.interface';

@Injectable()
export class GetPostByIdUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(id: string, user: IUser): Promise<IPost> {
    try {
      const post = this.postService.getPostById(new Types.ObjectId(id));

      if (!post) {
        throw new HttpException('Cannot get post', 500);
      }

      return post;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
