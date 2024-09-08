import { Controller } from '@nestjs/common';
import { KeywordsService } from './keywords.service';

@Controller()
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}
}
