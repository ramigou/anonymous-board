import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreatePostReqDtoForDb } from './dto/create-post.req.dto';
import { FindPostsReqDto } from './dto/find-posts.req.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostReqDtoForDb): Promise<Post> {
    const { title, content, password, salt, author } = createPostDto;
    const post = this.postsRepository.create({
      title,
      content,
      password,
      salt,
      author,
    });

    return await this.postsRepository.save(post);
  }

  async findAll(searchFilter: FindPostsReqDto): Promise<[Post[], number]> {
    const { title, author, limit = 10, page = 1 } = searchFilter;

    const whereConditions: FindOptionsWhere<Post>[] = [];

    if (title !== undefined) {
      whereConditions.push({ title: Like(`%${title}%`) });
    }

    if (author !== undefined) {
      whereConditions.push({
        author: { name: Like(`%${author}%`) },
      });
    }

    return await this.postsRepository.findAndCount({
      where: whereConditions,
      relations: ['author'],
      order: { id: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.postsRepository.findOne({ where: { id } });
  }

  async update(id: number, title?: string, content?: string): Promise<Post> {
    await this.postsRepository.update(id, { title, content });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.softDelete(id);
  }
}
