import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostsUsecase } from './usecase/createPost.usecase';
import { UpdatePostsUsecase } from './usecase/updatePost.usecase';
import { LikePostsUsecase } from './usecase/likePost.usecase';
import { CreateCommentUsecase } from './usecase/createComment.usecase';
import { GetPostsPaginationUsecase } from './usecase/getPagination.usecase';
import { GetPostByIdUsecase } from './usecase/getPostById.usecase';
import { LikeCommentUsecase } from './usecase/likeComment.usecase';
import { ReceiverPostsUsecase } from './usecase/receiverPost.usecase';

const usecases = [
  CreateCommentUsecase,
  CreatePostsUsecase,
  GetPostsPaginationUsecase,
  GetPostByIdUsecase,
  LikeCommentUsecase,
  LikePostsUsecase,
  ReceiverPostsUsecase,
  UpdatePostsUsecase
];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, ...usecases],
  exports: [],
})
export class PostsModule {}
