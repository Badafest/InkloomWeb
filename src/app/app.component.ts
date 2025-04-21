import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../ui/toast/toast.component';
import { HeaderComponent } from '../ui/header/header.component';
import { UserService } from './services/user.service';
import { isPlatformBrowser } from '@angular/common';
import { FooterComponent } from '../ui/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Inkloom';
  private _platformId = inject(PLATFORM_ID);

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      const tokenValidity = this.userService.checkAccessTokens();
      if (tokenValidity.accessToken || tokenValidity.refreshToken) {
        this.userService.syncUser();
      }
    }
  }
}
