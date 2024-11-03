import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import { CreateCommentDto } from '../dto/createComment.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { IPost } from '../posts.interface';

@Injectable()
export class CreateCommentUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: CreateCommentDto,
    id: string,
    user: IUser,
  ): Promise<IPost> {
    try {
      const post = await this.postService.updatePost(new Types.ObjectId(id), {
        $push: {
          comments: {
            _authorId: new Types.ObjectId(user._id),
            text: data.text,
          },
        },
      });

      if (!post) {
        throw new HttpException('Cannot create comment', 500);
      }

      return post;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
