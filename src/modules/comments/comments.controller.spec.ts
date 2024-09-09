import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { plainToInstance } from 'class-transformer';
import { CreateCommentReqDto } from './dto/create-comment.req.dto';
import { CreateCommentResDto } from './dto/create-comment.res.dto';
import { FindCommentsResDto } from './dto/find-comment.res.dto';
import { FindCommentsReqDto } from './dto/find-commnets.req.dto';
import { Comment } from '../../entities/comment.entity';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            createComment: jest.fn(),
            findAllComments: jest.fn(),
          },
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('should create a comment and return the result', async () => {
      // Arrange
      const createCommentDto: CreateCommentReqDto = {
        content: 'This is a comment',
        author_name: 'john doe',
        post_id: 1,
      };

      const newComment = {
        id: 1,
        ...createCommentDto,
        created_at: new Date(),
      } as unknown as Comment;

      jest
        .spyOn(commentsService, 'createComment')
        .mockResolvedValue(newComment);

      // Act
      const result = await commentsController.create(createCommentDto);

      // Assert
      expect(commentsService.createComment).toHaveBeenCalledWith(
        createCommentDto,
      );
      expect(result).toEqual(plainToInstance(CreateCommentResDto, newComment));
    });
  });

  describe('findAllComments', () => {
    it('should return comments and total count for a given post', async () => {
      // Arrange
      const findCommentsQuery: FindCommentsReqDto = {
        post_id: 1,
        page: 1,
        limit: 5,
      };

      const comments = [
        {
          id: 1,
          content: 'First comment',
          author_id: 1,
          post_id: 1,
          create_at: new Date(),
        },
        {
          id: 2,
          content: 'Second comment',
          author_id: 2,
          post_id: 1,
          created_at: new Date(),
        },
      ] as Comment[];

      const total = 10;

      jest
        .spyOn(commentsService, 'findAllComments')
        .mockResolvedValue({ comments, total });

      // Act
      const result =
        await commentsController.findAllComments(findCommentsQuery);

      // Assert
      expect(commentsService.findAllComments).toHaveBeenCalledWith(
        findCommentsQuery,
      );
      expect(result).toEqual(
        plainToInstance(FindCommentsResDto, { comments, total }),
      );
    });
  });
});
