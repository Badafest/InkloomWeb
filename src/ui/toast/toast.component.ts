import { Component } from '@angular/core';
import { NotificationService } from '../../app/services/notification.service';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  faClose = faClose;
  constructor(protected notificationService: NotificationService) {}
  closeToast(notificationId: string) {
    this.notificationService.removeNotification(notificationId);
  }
}
