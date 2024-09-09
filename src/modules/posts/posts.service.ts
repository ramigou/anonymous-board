import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostReqDto } from './dto/create-post.req.dto';
import { UpdatePostReqDto } from './dto/update-post.req.dto';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { PostsRepository } from './posts.repository';
import { AuthorsRepository } from '../authors/authors.repository';
import { FindPostsReqDto } from './dto/find-posts.req.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Post } from '../../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly authorsRepository: AuthorsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createPost(newPost: CreatePostReqDto): Promise<Post> {
    const salt = this.generateSalt();
    const hashedPassword = await this.hashPassword(newPost.password, salt);

    let author = await this.authorsRepository.findByName(newPost.author_name);
    if (author == null) {
      author = await this.authorsRepository.create(newPost.author_name);
    }

    const post = await this.postsRepository.create({
      ...newPost,
      password: hashedPassword,
      salt,
      author,
    });

    this.eventEmitter.emit('created', { post });

    return post;
  }

  async findAllPosts(
    searchFilter: FindPostsReqDto,
  ): Promise<{ posts: Post[]; total: number }> {
    const [posts, total] = await this.postsRepository.findAll(searchFilter);
    return { posts, total };
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.postsRepository.findOne(id);
  }

  async updatePost(id: number, updatedPost: UpdatePostReqDto): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    if (post == null) throw new NotFoundException('존재하지 않는 게시글');

    const isValidPassword = await this.verifyPassword(
      updatedPost.password,
      post.salt,
      post.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('게시글 수정 권한이 없음');

    const { title, content } = updatedPost;
    return await this.postsRepository.update(id, title, content);
  }

  async removePost(id: number, password: string): Promise<void> {
    const post = await this.postsRepository.findOne(id);
    if (post == null) throw new NotFoundException('존재하지 않는 게시글');

    const isValidPassword = await this.verifyPassword(
      password,
      post.salt,
      post.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('게시글 삭제 권한이 없음');

    await this.postsRepository.remove(id);
  }

  // password
  generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  async verifyPassword(
    inputPassword: string,
    salt: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const inputHashed = await this.hashPassword(inputPassword, salt);
    return inputHashed === hashedPassword;
  }
}
