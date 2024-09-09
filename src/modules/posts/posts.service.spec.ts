import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthorsRepository } from '../authors/authors.repository';
import { PostsRepository } from './posts.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Post } from 'src/entities/post.entity';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { Author } from 'src/entities/author.entity';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  let authorsRepository: AuthorsRepository;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    authorsRepository = module.get<AuthorsRepository>(AuthorsRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('createPost', () => {
    it('should create a post and emit an event', async () => {
      // Arrange
      const createPostDto: CreatePostReqDto = {
        title: 'New Post',
        content: 'This is a new post.',
        author_name: 'John Doe',
        password: 'password123',
      };
      const salt = 'some-random-salt';
      const hashedPassword = 'hashed-password';
      const author = { id: 1, name: 'John Doe' } as Author;
      const createdPost: Post = {
        id: 1,
        ...createPostDto,
        password: hashedPassword,
        salt,
        author,
        created_at: new Date(),
        author_id: 1,
        updated_at: undefined,
        deleted_at: undefined,
        comments: [],
        notifications: [],
      };

      jest.spyOn(postsService, 'generateSalt').mockReturnValue(salt);
      jest
        .spyOn(postsService, 'hashPassword')
        .mockResolvedValue(hashedPassword);
      jest.spyOn(authorsRepository, 'findByName').mockResolvedValue(null);
      jest.spyOn(authorsRepository, 'create').mockResolvedValue(author);
      jest.spyOn(postsRepository, 'create').mockResolvedValue(createdPost);
      jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

      // Act
      const result = await postsService.createPost(createPostDto);

      // Assert
      expect(postsService.generateSalt).toHaveBeenCalled();
      expect(postsService.hashPassword).toHaveBeenCalledWith(
        createPostDto.password,
        salt,
      );
      expect(authorsRepository.findByName).toHaveBeenCalledWith(
        createPostDto.author_name,
      );
      expect(authorsRepository.create).toHaveBeenCalledWith(
        createPostDto.author_name,
      );
      expect(postsRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        password: hashedPassword,
        salt,
        author,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith('created', {
        post: createdPost,
      });
      expect(result).toEqual(createdPost);
    });
  });

  describe('findAllPosts', () => {
    it('should return posts and total count', async () => {
      // Arrange
      const searchFilter = { keyword: 'test', page: 1, limit: 10 };
      const posts = [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test Content',
          author: { id: 1, name: 'John Doe' },
        } as Post,
      ];
      const total = 1;
      jest.spyOn(postsRepository, 'findAll').mockResolvedValue([posts, total]);

      // Act
      const result = await postsService.findAllPosts(searchFilter);

      // Assert
      expect(postsRepository.findAll).toHaveBeenCalledWith(searchFilter);
      expect(result).toEqual({ posts, total });
    });
  });

  describe('findOne', () => {
    it('should return a post if it exists', async () => {
      // Arrange
      const postId = 1;
      const post = {
        id: postId,
        title: 'Test Post',
        content: 'Test Content',
        author: { id: 1, name: 'John Doe' },
      } as Post;
      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(post);

      // Act
      const result = await postsService.findOne(postId);

      // Assert
      expect(postsRepository.findOne).toHaveBeenCalledWith(postId);
      expect(result).toEqual(post);
    });

    it('should return null if the post does not exist', async () => {
      // Arrange
      const postId = 1;
      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await postsService.findOne(postId);

      // Assert
      expect(postsRepository.findOne).toHaveBeenCalledWith(postId);
      expect(result).toBeNull();
    });
  });

  describe('updatePost', () => {
    it('should update a post if the password is correct', async () => {
      // Arrange
      const postId = 1;
      const updatePostDto: UpdatePostReqDto = {
        title: 'Updated Post',
        content: 'Updated Content',
        password: 'password123',
      };
      const existingPost = {
        id: postId,
        title: 'Old Post',
        content: 'Old Content',
        password: 'hashed-password',
        salt: 'salt',
      } as Post;
      const updatedPost = { ...existingPost, ...updatePostDto };

      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(existingPost);
      jest.spyOn(postsService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(postsRepository, 'update').mockResolvedValue(updatedPost);

      // Act
      const result = await postsService.updatePost(postId, updatePostDto);

      // Assert
      expect(postsRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postsService.verifyPassword).toHaveBeenCalledWith(
        updatePostDto.password,
        existingPost.salt,
        existingPost.password,
      );
      expect(postsRepository.update).toHaveBeenCalledWith(
        postId,
        updatePostDto.title,
        updatePostDto.content,
      );
      expect(result).toEqual(updatedPost);
    });

    it('should throw NotFoundException if the post does not exist', async () => {
      // Arrange
      const postId = 1;
      const updatePostDto: UpdatePostReqDto = {
        title: 'Updated Post',
        content: 'Updated Content',
        password: 'password123',
      };
      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(
        postsService.updatePost(postId, updatePostDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the password is incorrect', async () => {
      // Arrange
      const postId = 1;
      const updatePostDto: UpdatePostReqDto = {
        title: 'Updated Post',
        content: 'Updated Content',
        password: 'wrong-password',
      };
      const existingPost = {
        id: postId,
        title: 'Old Post',
        content: 'Old Content',
        password: 'hashed-password',
        salt: 'salt',
      } as Post;

      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(existingPost);
      jest.spyOn(postsService, 'verifyPassword').mockResolvedValue(false);

      // Act & Assert
      await expect(
        postsService.updatePost(postId, updatePostDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('removePost', () => {
    it('should remove a post if the password is correct', async () => {
      // Arrange
      const postId = 1;
      const password = 'password123';
      const existingPost = {
        id: postId,
        title: 'Post to Remove',
        password: 'hashed-password',
        salt: 'salt',
      } as Post;
      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(existingPost);
      jest.spyOn(postsService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(postsRepository, 'remove').mockResolvedValue();

      // Act
      await postsService.removePost(postId, password);

      // Assert
      expect(postsRepository.findOne).toHaveBeenCalledWith(postId);
      expect(postsService.verifyPassword).toHaveBeenCalledWith(
        password,
        existingPost.salt,
        existingPost.password,
      );
      expect(postsRepository.remove).toHaveBeenCalledWith(postId);
    });

    it('should throw NotFoundException if the post does not exist', async () => {
      // Arrange
      const postId = 1;
      const password = 'password123';
      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(postsService.removePost(postId, password)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if the password is incorrect', async () => {
      // Arrange
      const postId = 1;
      const password = 'wrong-password';
      const existingPost = {
        id: postId,
        title: 'Post to Remove',
        password: 'hashed-password',
        salt: 'salt',
      } as Post;
      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(existingPost);
      jest.spyOn(postsService, 'verifyPassword').mockResolvedValue(false);

      // Act & Assert
      await expect(postsService.removePost(postId, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
