import { LoginResponse } from '../models/login-response';
import { ApiService } from './api.service';
import { inject, Injectable, type Signal, signal } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Service is registered in root module and available app-wide
})
export class AuthService extends ApiService {
  private _userService = inject(UserService);
  private _notificationIds: string[] = [];

  private _ssoAuthLoading = signal(false);

  public get ssoAuthLoading(): Signal<boolean> {
    return this._ssoAuthLoading;
  }

  private readonly _ssoRedirectUri = `${environment.webBaseUrl}/oauth2`;

  public static readonly ssoTokenKey = 'sso:token';

  public async login(
    email: string,
    password: string,
    redirectTo: string = '/'
  ) {
    const loginResponse = await this.post<LoginResponse>('auth/login', {
      body: { email, password },
      skipAuthorization: true,
    });
    this.handleLoginResponse(loginResponse, redirectTo);
    return loginResponse;
  }

  public async magicLogin(
    email: string | null,
    token: string | null,
    redirectTo: string = '/'
  ) {
    const loginResponse = await this.post<LoginResponse | null>(
      'auth/magic-login',
      {
        body: { email, token },
        skipAuthorization: true,
      }
    );
    if (token) {
      this.handleLoginResponse(loginResponse, redirectTo);
    } else {
      loginResponse.subscribe({
        next: () => {
          this.notifications.addNotification(
            'Check Your Inbox',
            'If the email address is verified, you should receive the login link in your inbox'
          );
        },
        error: (error) => {
          const message =
            error.error?.message ?? error.message ?? error.toString();
          const notificationId = this.notifications.addNotification(
            'Magic Login Failed',
            message,
            'danger',
            5000
          );
          this._notificationIds.push(notificationId);
        },
      });
    }
    return loginResponse;
  }

  public async ssoLogin(
    authUrl: string,
    type: 'GOOGLE' | 'FACEBOOK' = 'GOOGLE',
    redirectTo: string = '/',
    newUser: boolean = false
  ) {
    this._ssoAuthLoading.set(true);
    // remove any previously set token
    localStorage.removeItem(AuthService.ssoTokenKey);
    window.open(authUrl, 'Sign in to Inkloom', 'width=500,height=600');

    let checkCount = 0;
    const checkInterval = setInterval(async () => {
      const ssoToken = localStorage.getItem(AuthService.ssoTokenKey) ?? '';
      // remove ssoToken immediately after accessing it
      localStorage.removeItem(AuthService.ssoTokenKey);

      if (!ssoToken) {
        if (checkCount > 30) {
          clearInterval(checkInterval);
        }
        checkCount++;
        return;
      }

      clearInterval(checkInterval);

      const loginResponse = await (newUser
        ? this.post<User | null>('auth/register', {
            body: { password: ssoToken, type },
            skipAuthorization: true,
          })
        : this.post<LoginResponse | null>('auth/sso-login', {
            body: { token: ssoToken, type },
            skipAuthorization: true,
          }));

      (loginResponse as any).subscribe({
        error: () => {
          this._ssoAuthLoading.set(false);
        },
        complete: () => {
          this._ssoAuthLoading.set(false);
        },
      });

      if (!newUser) {
        this.handleLoginResponse(
          loginResponse as Observable<{ data: LoginResponse }>,
          redirectTo
        );
      } else {
        this.handleRegisterResponse(
          loginResponse as Observable<{ data: User }>,
          redirectTo
        );
      }
    }, 1000);
  }

  async signInWithGoogle(redirectTo: string = '/', newUser: boolean = false) {
    const clientId = environment.googleClientId;
    const scope = 'email profile';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=token&redirect_uri=${this._ssoRedirectUri}&scope=${scope}`;

    await this.ssoLogin(authUrl, 'GOOGLE', redirectTo, newUser);
  }

  async signInWithFacebook(redirectTo: string = '/', newUser: boolean = false) {
    const clientId = environment.facebookAppId;
    var scope = 'email,public_profile';

    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&response_type=token&redirect_uri=${this._ssoRedirectUri}&scope=${scope}`;

    await this.ssoLogin(authUrl, 'FACEBOOK', redirectTo, newUser);
  }

  ssoLogOut(): void {
    localStorage.removeItem(AuthService.ssoTokenKey);
  }

  private handleLoginResponse(
    loginResponse: Observable<{ data: LoginResponse | null }>,
    redirectTo: string = '/'
  ) {
    loginResponse.subscribe({
      next: ({ data }) => {
        data && this.setAuthTokens(data);
        this._notificationIds.forEach((id) =>
          this.notifications.removeNotification(id)
        );
        this._userService
          .syncUser()
          .then(() => this.router.navigateByUrl(redirectTo))
          .catch((err) => {
            throw err;
          });
      },
      error: (error) => {
        const message =
          error.error?.message ?? error.message ?? error.toString();
        const notificationId = this.notifications.addNotification(
          'Login Failed',
          message,
          'danger',
          5000
        );
        this._notificationIds.push(notificationId);
      },
    });
  }

  public async register(
    username: string,
    email: string,
    password: string,
    redirectTo: string = '/login'
  ) {
    const registerResponse = await this.post<User>('auth/register', {
      body: { username, email, password },
      skipAuthorization: true,
    });
    this.handleRegisterResponse(registerResponse, redirectTo);
    return registerResponse;
  }

  private handleRegisterResponse(
    registerResponse: Observable<{ data: User }>,
    redirectTo: string = '/login'
  ) {
    registerResponse.subscribe({
      next: () => {
        this._notificationIds.forEach((id) =>
          this.notifications.removeNotification(id)
        );
        this.router.navigateByUrl(redirectTo);
      },
      error: (error) => {
        const message =
          error.error?.message ?? error.message ?? error.toString();
        const notificationId = this.notifications.addNotification(
          'Register Failed',
          message,
          'danger',
          5000
        );
        this._notificationIds.push(notificationId);
      },
    });
  }
}
