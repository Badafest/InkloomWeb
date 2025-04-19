import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css',
})
export class RootComponent {
  constructor(private notifications: NotificationService) {}

  addNotification = () => {
    this.notifications.addNotification(
      'Hello!',
      'Welcome to Inkloom',
      'primary',
      5000
    );
  };
}
