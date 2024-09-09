import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { plainToInstance } from 'class-transformer';
import { CreatePostResDto } from './dto/creat-post.res.dto';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { DeletePostReqDto } from './dto/delete-post.req.dto';
import { FindPostsReqDto } from './dto/find-posts.req.dto';
import { FindPostsResDto } from './dto/find-posts.res.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { UpdatePostResDto } from './dto/update-post.res.dto';
import { Post } from '../../entities/post.entity';
import { Author } from '../../entities/author.entity';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createPost: jest.fn(),
            findAllPosts: jest.fn(),
            updatePost: jest.fn(),
            removePost: jest.fn(),
          },
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('createPost', () => {
    it('should create a post and return the result', async () => {
      // Arrange
      const createPostReqDto: CreatePostReqDto = {
        title: 'New Post',
        content: 'This is a new post.',
        author_name: 'anonymous',
        password: 'password123',
      };
      const createdPost: Post = {
        id: 1,
        ...createPostReqDto,
        created_at: new Date(),
        author_id: 1,
        author: new Author(),
        salt: '',
        updated_at: undefined,
        deleted_at: undefined,
        comments: [],
        notifications: [],
      };
      jest.spyOn(postsService, 'createPost').mockResolvedValue(createdPost);

      // Act
      const result = await postsController.createPost(createPostReqDto);

      // Assert
      expect(postsService.createPost).toHaveBeenCalledWith(createPostReqDto);
      expect(result).toEqual(plainToInstance(CreatePostResDto, createdPost));
    });
  });

  describe('findAllPosts', () => {
    it('should return a list of posts and total count', async () => {
      // Arrange
      const query: FindPostsReqDto = { title: 'test', page: 1, limit: 10 };
      const postsAndTotal = {
        posts: [
          {
            id: 1,
            title: 'Test Post',
            content: 'Test Content',
            author_id: 1,
            created_at: new Date(),
            author: new Author(),
            password: '',
            salt: '',
            updated_at: undefined,
            deleted_at: undefined,
            comments: [],
            notifications: [],
          },
        ],
        total: 1,
      };
      jest.spyOn(postsService, 'findAllPosts').mockResolvedValue(postsAndTotal);

      // Act
      const result = await postsController.findAllPosts(query);

      // Assert
      expect(postsService.findAllPosts).toHaveBeenCalledWith(query);
      expect(result).toEqual(plainToInstance(FindPostsResDto, postsAndTotal));
    });
  });

  describe('updatePost', () => {
    it('should update a post and return the updated result', async () => {
      // Arrange
      const updatePostReqDto: UpdatePostReqDto = {
        title: 'Updated Post',
        content: 'Updated Content',
        password: 'password123',
      };
      const updatedPost: Post = {
        id: 1,
        title: 'Updated Post',
        content: 'Updated Content',
        author_id: 1,
        updated_at: new Date(),
        author: new Author(),
        password: '',
        salt: '',
        created_at: undefined,
        deleted_at: undefined,
        comments: [],
        notifications: [],
      };
      jest.spyOn(postsService, 'updatePost').mockResolvedValue(updatedPost);

      // Act
      const result = await postsController.updatePost(1, updatePostReqDto);

      // Assert
      expect(postsService.updatePost).toHaveBeenCalledWith(1, updatePostReqDto);
      expect(result).toEqual(plainToInstance(UpdatePostResDto, updatedPost));
    });
  });

  describe('removePost', () => {
    it('should remove a post successfully', async () => {
      // Arrange
      const deletePostReqDto: DeletePostReqDto = { password: 'password123' };
      jest.spyOn(postsService, 'removePost').mockResolvedValue();

      // Act
      await postsController.removePost(1, deletePostReqDto);

      // Assert
      expect(postsService.removePost).toHaveBeenCalledWith(
        1,
        deletePostReqDto.password,
      );
    });
  });
});
