import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCheck, faClose, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SsoAuthType } from '../models/user';

@Component({
  selector: 'app-oauth2',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './oauth2.component.html',
  styleUrl: './oauth2.component.css',
})
export class Oauth2Component implements OnInit {
  faLoading = faSpinner;
  faSuccess = faCheck;
  faFailed = faClose;

  verifying: boolean = true;
  loggingIn: boolean = false;
  tokenMessage: string = 'Parsing access token...';
  loginMessage: string = '';

  private _platformId = inject(PLATFORM_ID);
  private _authService = inject(AuthService);

  ngOnInit(): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const ssoToken = hashParams.get('access_token');

      if (!ssoToken) {
        throw new Error('Access token not found');
      }

      const stateParamsBase64 =
        hashParams.get('state') ??
        new URLSearchParams(window.location.search).get('state') ??
        '';

      const decodedParams = atob(stateParamsBase64);

      const queryParams = new URLSearchParams(decodedParams);

      const authType = queryParams.get('type') as SsoAuthType;
      const newUser = queryParams.get('new_user') === 'true';
      const redirectTo =
        queryParams.get('redirect_to') ?? (newUser ? '/login' : '/dashboard');

      this.tokenMessage = 'Token parse successful ...';
      this.verifying = false;

      this.loginMessage = 'Logging in ...';
      this.loggingIn = true;

      this._authService
        .ssoLogin(ssoToken, authType, redirectTo, newUser)
        .then((loginResponse) => {
          (loginResponse as any).subscribe({
            error: () => {
              this.loggingIn = false;
              this.loginMessage = 'Login failed ...';
            },
            complete: () => {
              this.loggingIn = false;
              this.loginMessage = 'Login successful ...';
            },
          });
        });

      // localStorage.setItem(AuthService.ssoTokenKey, accessToken ?? '');
    } catch (error) {
      this.tokenMessage = 'Token parse failed ...';
      this.verifying = false;
    }
  }
}
