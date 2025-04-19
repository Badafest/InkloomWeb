import { LoginResponse } from '../models/login-response';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Service is registered in root module and available app-wide
})
export class AuthService extends ApiService {
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

    loginResponse.subscribe({
      next: ({ data }) => {
        this.setAuthTokens(data);
        this._notificationIds.forEach((id) =>
          this.notifications.removeNotification(id)
        );
        this.router.navigateByUrl(redirectTo);
      },
      error: (error) => {
        const message =
          error.error?.message ?? error.message ?? error.toString();
        const notificationId = this.notifications.addNotification(
          'Login Failed',
          message,
          'danger'
        );
        this._notificationIds.push(notificationId);
      },
    });
    return loginResponse;
  }
}
