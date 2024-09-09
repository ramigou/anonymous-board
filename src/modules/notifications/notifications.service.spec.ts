import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationReqDto } from './dto/create-notification.req.dto';
import { Notification } from '../../entities/notification.entity';
import { Author } from '../../entities/author.entity';
import { Keyword } from '../../entities/keyword.entity';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../entities/comment.entity';

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let notificationsRepository: NotificationsRepository;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationsRepository,
          useValue: {
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

    notificationsService =
      module.get<NotificationsService>(NotificationsService);
    notificationsRepository = module.get<NotificationsRepository>(
      NotificationsRepository,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('createNotification', () => {
    it('should create a notification and emit an event', async () => {
      // Arrange
      const createNotificationDto: CreateNotificationReqDto = {
        recipient_id: 1,
        keyword_id: 1,
        content_type: 'post',
        post_id: 1,
        comment_id: null,
        message: 'New notification',
      };

      const createdNotification: Notification = {
        id: 1,
        ...createNotificationDto,
        recipient: new Author(),
        keyword: new Keyword(),
        post: new Post(),
        comment: new Comment(),
        created_at: new Date(),
        is_read: false,
      } as Notification;

      jest
        .spyOn(notificationsRepository, 'create')
        .mockResolvedValue(createdNotification);
      jest.spyOn(eventEmitter, 'emit').mockImplementation(() => true);

      // Act
      const result = await notificationsService.createNotification(
        createNotificationDto,
      );

      // Assert
      expect(notificationsRepository.create).toHaveBeenCalledWith(
        createNotificationDto,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'new.notification',
        createdNotification,
      );
      expect(result).toEqual(createdNotification);
    });
  });
});
