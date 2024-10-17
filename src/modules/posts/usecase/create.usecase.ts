import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { CreatePostsDto } from '../dto/create.dto';

@Injectable()
export class CreatePostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: CreatePostsDto & { _profileId: Types.ObjectId },
  ): Promise<HttpRespons> {
    try {
      const post = await this.postService.createPost({
        ...data,
        _profileId: new Types.ObjectId(data._profileId),
      });

      if (!post) {
        throw new HttpException('Cannot create post', 500);
      }

      return {
        message: 'Create post success',
      };
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
