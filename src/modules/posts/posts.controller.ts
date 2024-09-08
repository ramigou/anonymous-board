import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeletePostReqDto } from './dto/delete-post.req.dto';
import { FindPostsReqDto } from './dto/find-posts.req.dto';

// TODO response dto 에서 password, salt 제거
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBody({ type: CreatePostReqDto })
  @Post()
  async createPost(@Body() body: CreatePostReqDto) {
    return await this.postsService.createPost(body);
  }

  @Get()
  async findAllPosts(@Query() query: FindPostsReqDto) {
    console.log('# controller:', query);
    return await this.postsService.findAllPosts(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(+id);
  }

  @ApiBody({ type: UpdatePostReqDto })
  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostReqDto,
  ) {
    return await this.postsService.updatePost(id, body);
  }

  @ApiBody({ type: DeletePostReqDto })
  @Delete(':id')
  async removePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DeletePostReqDto,
  ) {
    return await this.postsService.removePost(id, body.password);
  }
}
