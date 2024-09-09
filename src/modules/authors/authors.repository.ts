import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from '../../entities/author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
  ) {}

  async findByName(name: string): Promise<Author | null> {
    return await this.authorsRepository.findOne({ where: { name } });
  }

  async create(name: string): Promise<Author> {
    const author = this.authorsRepository.create({ name });
    return await this.authorsRepository.save(author);
  }
}
