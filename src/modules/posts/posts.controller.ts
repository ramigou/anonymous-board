import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeletePostReqDto } from './dto/delete-post.req.dto';
import { FindPostsReqDto } from './dto/find-posts.req.dto';
import { plainToInstance } from 'class-transformer';
import { CreatePostResDto } from './dto/creat-post.res.dto';
import { FindPostsResDto } from './dto/find-posts.res.dto';
import { UpdatePostResDto } from './dto/update-post.res.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOkResponse({
    type: () => CreatePostResDto,
    description: '게시글 작성 결과',
  })
  @Post()
  async createPost(@Body() body: CreatePostReqDto): Promise<CreatePostResDto> {
    const newPost = await this.postsService.createPost(body);
    return plainToInstance(CreatePostResDto, newPost);
  }

  @ApiOkResponse({
    type: () => FindPostsResDto,
    description: '검색 결과 게시글 목록과 게시글 수',
  })
  @Get()
  async findAllPosts(
    @Query() query: FindPostsReqDto,
  ): Promise<FindPostsResDto> {
    const postsAndTotal = await this.postsService.findAllPosts(query);
    return plainToInstance(FindPostsResDto, postsAndTotal);
  }

  @ApiOkResponse({
    type: () => UpdatePostResDto,
    description: '수정한 게시글 결과',
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글을 수정하려고 함' })
  @ApiUnauthorizedResponse({ description: '게시글 비밀번호가 올바르지 않음' })
  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostReqDto,
  ) {
    const updatedPost = await this.postsService.updatePost(id, body);
    return plainToInstance(UpdatePostResDto, updatedPost);
  }

  @ApiOkResponse({ description: '게시글 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글을 삭제하려고 함' })
  @ApiUnauthorizedResponse({ description: '게시글 비밀번호가 올바르지 않음' })
  @Delete(':id')
  async removePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DeletePostReqDto,
  ): Promise<void> {
    await this.postsService.removePost(id, body.password);
  }
}
