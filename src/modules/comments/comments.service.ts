import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { CommentsRepository } from './comments.repository';
import { AuthorsRepository } from '../authors/authors.repository';
import { PostsService } from '../posts/posts.service';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly authorsRepository: AuthorsRepository,
    private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createComment(newComment: CreateCommentReqDto): Promise<Comment> {
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

    console.log('# comment', comment);
    return comment;
  }

  async findAllComments(
    filter: FindCommentsReqDto,
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await Promise.all([
      this.commentsRepository.findAll(filter),
      this.commentsRepository.countAll(filter.post_id),
    ]);

    return { comments, total };
  }
}
