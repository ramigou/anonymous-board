import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class NotificationsListener {
  @OnEvent('new.notification')
  handleNewNotificationEvent(event: Notification) {
    console.log('* new notification *', event);
  }
}
