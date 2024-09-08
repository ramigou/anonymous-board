import { Injectable } from '@nestjs/common';
import { CreateNotificationReqDto } from './dto/create-notification.req.dto';
import { NotificationsRepository } from './notifications.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationReqDto) {
    const notification = await this.notificationsRepository.create(
      createNotificationDto,
    );

    this.eventEmitter.emit('new.notification', notification);

    return notification;
  }
}
