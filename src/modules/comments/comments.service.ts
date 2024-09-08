import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { CommentsRepository } from './comments.repository';
import { AuthorsRepository } from '../authors/authors.repository';
import { PostsService } from '../posts/posts.service';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

// TODO service
@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly authorsRepository: AuthorsRepository,
    private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createComment(newComment: CreateCommentReqDto) {
    let author = await this.authorsRepository.findByName(
      newComment.author_name,
    );
    if (author == null) {
      author = await this.authorsRepository.create(newComment.author_name);
    }

    const post = await this.postsService.findOne(newComment.post_id);
    if (post == null) throw new NotFoundException('존재하지 않는 게시글');

    const comment = await this.commentsRepository.create({
      ...newComment,
      author,
      post,
    });

    this.eventEmitter.emit('created', { comment });

    return comment;
  }

  async findAllComments(filter: FindCommentsReqDto) {
    // TODO child comment 중복 처리
    return await this.commentsRepository.findAll(filter);
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }
}
