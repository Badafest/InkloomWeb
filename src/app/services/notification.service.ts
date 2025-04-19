import { Injectable } from '@angular/core';
import { Notification } from '../models/notification';
import { TVariant } from '../../ui/types';
import { v4 as randomUUID } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notifications: Notification[] = [];

  public get notifications(): Notification[] {
    return this._notifications;
  }

  constructor() {}

  getNotification(notificationId: string) {
    return this._notifications.find(({ id }) => id === notificationId);
  }

  addNotification(
    title: string,
    message: string = '',
    variant: TVariant = 'primary',
    autoCloseAfterMs: number = 0
  ) {
    const newNotification = {
      id: randomUUID(),
      dateTime: new Date(),
      title,
      message,
      variant,
    };
    const index = this._notifications.findIndex(
      ({ dateTime }) => dateTime > newNotification.dateTime
    );
    this._notifications = [
      ...this._notifications.slice(0, index + 1),
      newNotification,
      ...this._notifications.slice(index + 1),
    ];
    if (autoCloseAfterMs > 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, autoCloseAfterMs);
    }
    return newNotification.id;
  }

  updateNotification(
    notificationId: string,
    title: string,
    message: string = '',
    variant: TVariant = 'primary'
  ) {
    let updated = 0;
    this._notifications = this._notifications.map((notification) => {
      if (notification.id === notificationId) {
        updated++;
        return { ...notification, title, message, variant };
      }
      return notification;
    });
    return updated;
  }

  removeNotification(notificationId: string) {
    this._notifications = this._notifications.filter(
      ({ id }) => id !== notificationId
    );
    return this._notifications.length;
  }
}
