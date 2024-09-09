import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../../entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationReqDto } from './dto/create-notification.req.dto';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationReqDto) {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );

    return await this.notificationsRepository.save(notification);
  }
}
