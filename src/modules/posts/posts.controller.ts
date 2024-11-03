import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostsUsecase } from './usecase/createPost.usecase';
import GetPostsPaginationDto from './dto/getPaginationPost.dto';
import { CreatePostsDto } from './dto/createPost.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { UpdatePostsUsecase } from './usecase/updatePost.usecase';
import { LikePostsUsecase } from './usecase/likePost.usecase';
import { GetPostsPaginationUsecase } from './usecase/getPagination.usecase';
import { CreateCommentUsecase } from './usecase/createComment.usecase';
import { LikeCommentUsecase } from './usecase/likeComment.usecase';
import { ReceiverPostsUsecase } from './usecase/receiverPost.usecase';
import { GetPostByIdUsecase } from './usecase/getPostById.usecase';
import { IUser } from '../user/interfaces/user.interface';
import { IPost } from './posts.interface';
import UpdatePostsDto from './dto/updatePost.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { HttpRespons, HttpResponsePagination } from 'src/interface/respones';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostsUsecase: CreatePostsUsecase,
    private readonly getPaginationUsecase: GetPostsPaginationUsecase,
    private readonly updatePostsUsecase: UpdatePostsUsecase,
    private readonly likePostsUsecase: LikePostsUsecase,
    private readonly commentPostsUsecase: CreateCommentUsecase,
    private readonly likeCommentPostsUsecase: LikeCommentUsecase,
    private readonly updateStatusPostsUsecase: ReceiverPostsUsecase,
    private readonly getByIdUsecase: GetPostByIdUsecase,
  ) {}

  @Post()
  public async createPosts(
    @User() user: IUser,
    @Body() data: CreatePostsDto,
  ): Promise<IPost> {
    return this.createPostsUsecase.execute(data, user);
  }

  @Get()
  public async getPagination(
    @Query() query: GetPostsPaginationDto,
    @User() user: IUser,
  ): Promise<HttpResponsePagination<IPost>> {
    return this.getPaginationUsecase.execute(query, user);
  }

  @Put(':id')
  public async updatePosts(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() data: UpdatePostsDto,
  ): Promise<HttpRespons> {
    return this.updatePostsUsecase.execute(data, id, user);
  }

  @Get('like/:id')
  public async likePosts(
    @User() user: IUser,
    @Param('id') id: string,
  ): Promise<IPost> {
    return this.likePostsUsecase.execute(id, user);
  }

  @Post('comment/:id')
  public async createComment(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() data: CreateCommentDto,
  ): Promise<IPost> {
    return this.commentPostsUsecase.execute(data, id, user);
  }

  @Get('comment/like/:postId/:commentId')
  public async likeCommentPosts(
    @User() user: IUser,
    @Param('postId') id: string,
    @Param('commentId') commentId: string,
  ): Promise<IPost> {
    return this.likeCommentPostsUsecase.execute(commentId, id, user);
  }

  @Put('receiver/:id')
  public async updateStatus(
    @User() user: IUser,
    @Param('id') id: string,
  ): Promise<IPost> {
    return this.updateStatusPostsUsecase.execute(id, user);
  }

  @Get(':id')
  public async getPost(
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<IPost> {
    return this.getByIdUsecase.execute(id, user);
  }
}
