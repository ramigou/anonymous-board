import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsService } from './keywords.service';
import { KeywordsRepository } from './keywords.repository';
import { Keyword } from '../../entities/keyword.entity';
import { Author } from '../../entities/author.entity';

describe('KeywordsService', () => {
  let keywordsService: KeywordsService;
  let keywordsRepository: KeywordsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: KeywordsRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    keywordsService = module.get<KeywordsService>(KeywordsService);
    keywordsRepository = module.get<KeywordsRepository>(KeywordsRepository);
  });

  describe('findAllKeywords', () => {
    it('should return an array of keywords', async () => {
      // Arrange
      const keywords: Keyword[] = [
        {
          id: 1,
          keyword: 'keyword1',
          author_id: 1,
          created_at: new Date(),
          deleted_at: null,
          author: new Author(),
          notifications: [],
        },
        {
          id: 2,
          keyword: 'keyword2',
          author_id: 2,
          created_at: new Date(),
          deleted_at: null,
          author: new Author(),
          notifications: [],
        },
      ];

      jest.spyOn(keywordsRepository, 'findAll').mockResolvedValue(keywords);

      // Act
      const result = await keywordsService.findAllKeywords();

      // Assert
      expect(keywordsRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(keywords);
    });
  });
});
