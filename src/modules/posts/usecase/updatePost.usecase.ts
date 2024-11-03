import { HttpException, Injectable } from '@nestjs/common';
import { HttpRespons } from 'src/interface/respones';
import { Types } from 'mongoose';
import { PostsService } from '../posts.service';
import UpdatePostsDto from '../dto/updatePost.dto';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { EUserRole } from 'src/modules/user/constants/user.constant';

@Injectable()
export class UpdatePostsUsecase {
  constructor(private readonly postService: PostsService) {}

  public async execute(
    data: UpdatePostsDto,
    id: string,
    user: IUser,
  ): Promise<HttpRespons> {
    try {
      switch (user.role[0]) {
        case EUserRole.USER:
          const post = await this.postService.getPostById(
            new Types.ObjectId(id),
          );
          if (!post) {
            throw new HttpException('Cannot update this post', 500);
          }
          if (post._receiverId) {
            throw new HttpException('You cannot update this post', 500);
          }
          if (!post._authorId.equals(user._id)) {
            throw new HttpException('You cannot update this post', 500);
          }
          break;
        default:
          throw new HttpException('You cannot update this post', 500);
      }

      const post = await this.postService.updatePost(new Types.ObjectId(id), {
        $set: {
          title: data.title,
          content: data.content,
          images: data.images,
          isHidden: data.isHidden,
          tags: data.tags,
          location: data.location,
          status: data.status,
        },
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
