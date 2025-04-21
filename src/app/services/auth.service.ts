import { LoginResponse } from '../models/login-response';
import { ApiService } from './api.service';
import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Service is registered in root module and available app-wide
})
export class AuthService extends ApiService {
  private _userService = inject(UserService);
  private _notificationIds: string[] = [];

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
  public async register(username: string, email: string, password: string) {
    const registerResponse = await this.post<User>('auth/register', {
      body: { username, email, password },
      skipAuthorization: true,
    });

    registerResponse.subscribe({
      next: () => {
        this._notificationIds.forEach((id) =>
          this.notifications.removeNotification(id)
        );
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
    return registerResponse;
  }
}
