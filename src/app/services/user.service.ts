import { Injectable, Signal, signal } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  private _user = signal<User | null>(null);

  public get user(): Signal<User | null> {
    return this._user;
  }

  public isAuthenticated(): boolean {
    const tokensValidity = this.checkAccessTokens();
    return tokensValidity.accessToken || tokensValidity.refreshToken;
  }

  public async checkUsername(username: string) {
    const response = await this.get<boolean>(
      `user/check-username?username=${username}`,
      {
        skipAuthorization: true,
      }
    );
    response.subscribe({
      error: (err) => {
        this.notifications.addNotification(
          'Username Check Failed',
          err?.error?.message ?? err?.message ?? err,
          'danger',
          5000
        );
      },
    });
    return response;
  }

  public async syncUser() {
    const response = await this.get<User>('user');
    response.subscribe({
      next: ({ data }) => this._user.set(data),
      error: (err) => {
        this.notifications.addNotification(
          'User Sync Failed',
          err?.error?.message ?? err?.message ?? err,
          'danger'
        );
      },
    });
    return response;
  }

  public async updateUser(updatedUser: Partial<User>) {
    const formData = new FormData();

    formData.append('about', updatedUser.about ?? '');
    formData.append('avatar', updatedUser.avatar ?? '');
    formData.append('avatarImage', updatedUser.avatarImage ?? '');
    formData.append('displayName', updatedUser.displayName ?? '');

    const response = await this.patch<User>('user', {
      body: formData,
      nonJsonContent: true,
    });
    response.subscribe({
      next: ({ data }) => this._user.set(data),
      error: (err) => {
        this.notifications.addNotification(
          'User Update Failed',
          err?.error?.message ?? err?.message ?? err,
          'danger',
          5000
        );
      },
    });
    return response;
  }

  public async deleteUser() {
    const response = await this.delete<any>(`user`);
    response.subscribe({
      error: (err) => {
        this.notifications.addNotification(
          'User Delete Failed',
          err?.error?.message ?? err?.message ?? err,
          'danger',
          5000
        );
      },
    });
    return response;
  }

  public logout() {
    this._user.set(null);
    Object.keys(localStorage)
      .filter((key) => /^auth\:/.test(key))
      .forEach((key) => localStorage.removeItem(key));
    this.router.navigateByUrl('/');
  }
}
