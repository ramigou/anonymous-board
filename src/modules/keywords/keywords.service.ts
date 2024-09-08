import { Injectable } from '@nestjs/common';
import { KeywordsRepository } from './keywords.repository';

@Injectable()
export class KeywordsService {
  constructor(private readonly keywordsRepository: KeywordsRepository) {}

  async findAllKeywords() {
    return await this.keywordsRepository.findAll();
  }
}
