import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyword } from 'src/entities/keyword.entity';
import { Repository } from 'typeorm';

@Injectable()
export class KeywordsRepository {
  constructor(
    @InjectRepository(Keyword) private keywordsRepository: Repository<Keyword>,
  ) {}

  async findAll(): Promise<Keyword[]> {
    return await this.keywordsRepository.find();
  }
}
