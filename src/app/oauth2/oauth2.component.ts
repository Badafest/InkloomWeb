import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-oauth2',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './oauth2.component.html',
  styleUrl: './oauth2.component.css',
})
export class Oauth2Component implements OnInit {
  verifying: boolean = true;
  faLoading = faSpinner;
  statusMessage: string = 'Parsing access token...';
  waitingMessage: string = '';

  private _platformId = inject(PLATFORM_ID);

  closeWindow() {
    window.close();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      localStorage.setItem(AuthService.ssoTokenKey, accessToken ?? '');
      this.statusMessage = 'Token parse successful ...';
    } catch (error) {
      this.statusMessage = 'Token parse failed ...';
    } finally {
      this.verifying = false;
      let seconds = 6;
      const closeInterval = setInterval(() => {
        seconds -= 1;
        this.waitingMessage = `Closing in ${seconds} seconds ...`;
        if (seconds <= 0 || !localStorage.getItem(AuthService.ssoTokenKey)) {
          localStorage.removeItem(AuthService.ssoTokenKey);
          clearInterval(closeInterval);
          this.closeWindow();
        }
      }, 1000);
    }
  }
}
