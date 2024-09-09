import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthorsRepository } from '../authors/authors.repository';
import { PostsService } from '../posts/posts.service';
import { CommentsRepository } from './comments.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';
import { Author } from '../../entities/author.entity';
import { Comment } from '../../entities/comment.entity';
import { Post } from '../../entities/post.entity';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentsRepository: CommentsRepository;
  let authorsRepository: AuthorsRepository;
  let postsService: PostsService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            countAll: jest.fn(),
          },
        },
        {
          provide: AuthorsRepository,
          useValue: {
            findByName: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: PostsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentsRepository = module.get<CommentsRepository>(CommentsRepository);
    authorsRepository = module.get<AuthorsRepository>(AuthorsRepository);
    postsService = module.get<PostsService>(PostsService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('createComment', () => {
    it('should create a comment and emit an event', async () => {
      // Arrange
      const createCommentDto: CreateCommentReqDto = {
        content: 'This is a comment',
        author_name: 'Author Name',
        post_id: 1,
      };

      const author = { id: 1, name: 'Author Name' } as Author;
      const post = {
        id: 1,
        title: 'Post Title',
        content: 'Post Content',
      } as Post;
      const newComment: Comment = {
        id: 1,
        ...createCommentDto,
        author,
        post,
        created_at: new Date(),
        author_id: 1,
        parent_comment_id: 1,
        updated_at: undefined,
        deleted_at: undefined,
        parentComment: new Comment(),
        childComments: [],
        notifications: [],
      };

      jest.spyOn(authorsRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(authorsRepository, 'create').mockResolvedValue(author);
      jest.spyOn(postsService, 'findOne').mockResolvedValue(post);
      jest.spyOn(commentsRepository, 'create').mockResolvedValue(newComment);
      jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

      // Act
      const result = await commentsService.createComment(createCommentDto);

      // Assert
      expect(authorsRepository.findByName).toHaveBeenCalledWith(
        createCommentDto.author_name,
      );
      expect(authorsRepository.create).toHaveBeenCalledWith(
        createCommentDto.author_name,
      );
      expect(postsService.findOne).toHaveBeenCalledWith(
        createCommentDto.post_id,
      );
      expect(commentsRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        author,
        post,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('created', {
        comment: newComment,
      });
      expect(result).toEqual(newComment);
    });

    it('should throw NotFoundException if the post does not exist', async () => {
      // Arrange
      const createCommentDto: CreateCommentReqDto = {
        content: 'This is a comment',
        author_name: 'Author Name',
        post_id: 1,
      };

      jest.spyOn(postsService, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(
        commentsService.createComment(createCommentDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllComments', () => {
    it('should return comments and total count', async () => {
      // Arrange
      const filter: FindCommentsReqDto = {
        post_id: 1,
        page: 1,
        limit: 5,
      };

      const comments = [
        {
          id: 1,
          content: 'Comment 1',
          author_id: 1,
          post_id: 1,
          created_at: new Date(),
        },
        {
          id: 2,
          content: 'Comment 2',
          author_id: 2,
          post_id: 1,
          created_at: new Date(),
        },
      ] as Comment[];

      const total = 10;

      jest.spyOn(commentsRepository, 'findAll').mockResolvedValue(comments);
      jest.spyOn(commentsRepository, 'countAll').mockResolvedValue(total);

      // Act
      const result = await commentsService.findAllComments(filter);

      // Assert
      expect(commentsRepository.findAll).toHaveBeenCalledWith(filter);
      expect(commentsRepository.countAll).toHaveBeenCalledWith(filter.post_id);
      expect(result).toEqual({ comments, total });
    });
  });
});
