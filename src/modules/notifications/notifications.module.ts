import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from 'src/entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsListener } from './notifications.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificationsListener,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
