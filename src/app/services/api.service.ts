import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/login-response';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

type TRequestOptions = {
  nonJsonContent?: boolean;
  skipAuthorization?: boolean;
  skipJoinUrl?: boolean;
  asPromise?: boolean;
  body?: { [k: string]: any };
};

@Injectable()
export abstract class ApiService {
  private _apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    protected router: Router,
    protected notifications: NotificationService
  ) {}

  protected async get<T>(endpoint: string, options: TRequestOptions = {}) {
    return this.request<T>('get', endpoint, options);
  }

  protected async post<T>(endpoint: string, options: TRequestOptions = {}) {
    return this.request<T>('post', endpoint, options);
  }

  protected async put<T>(endpoint: string, options: TRequestOptions = {}) {
    return this.request<T>('put', endpoint, options);
  }

  protected async patch<T>(endpoint: string, options: TRequestOptions = {}) {
    return this.request<T>('patch', endpoint, options);
  }

  protected async delete<T>(endpoint: string, options: TRequestOptions = {}) {
    return this.request<T>('delete', endpoint, options);
  }

  protected setAuthTokens(loginResponse: LoginResponse) {
    localStorage.setItem('auth:username', loginResponse.username);
    localStorage.setItem(
      'auth:accessToken:value',
      loginResponse.accessToken.value
    );
    localStorage.setItem(
      'auth:accessToken:expiry',
      loginResponse.accessToken.expiry
    );
    localStorage.setItem(
      'auth:refreshToken:value',
      loginResponse.refreshToken.value
    );
    localStorage.setItem(
      'auth:refreshToken:expiry',
      loginResponse.refreshToken.expiry
    );
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    options: TRequestOptions
  ): Promise<Observable<{ data: T }>> {
    const fullUrl = options.skipJoinUrl
      ? endpoint
      : `${this._apiBaseUrl}/${endpoint}`
          .replaceAll(/(\/\/)/g, '/')
          .replace(':/', '://');

    let headers = new HttpHeaders();

    // content type headers
    if (!options.nonJsonContent) {
      headers = headers.set('Content-Type', 'application/json;charset=utf-8');
    }

    // authorization headers (bearer token)
    if (!options.skipAuthorization) {
      var authTokens = await this.getAuthTokens();
      if (!authTokens) {
        throw new Error(
          "Couldn't fetch authorization tokens. Aborting the request"
        );
      }
      headers = headers.set(
        'Authorization',
        `Bearer ${authTokens.accessToken.value}`
      );
    }

    const requestOptions: { [k: string]: any } = { headers };

    // request body for POST, PUT and PATCH requests
    if (['post', 'put', 'patch'].includes(method)) {
      requestOptions['body'] = options.body;
    }

    return this.http.request<{ data: T }>(method, fullUrl, requestOptions);
  }

  checkAccessTokens() {
    const storedTokens = this.getStoredTokens();
    return {
      // check if the access token is valid for next 60 seconds
      accessToken:
        new Date(storedTokens.accessToken.expiry).valueOf() >
        Date.now() + 60000,
      // check if we can use refresh token to get new tokens
      // keep a buffer of 10 seconds for refreshing tokens
      refreshToken:
        new Date(storedTokens.refreshToken.expiry).valueOf() >
        Date.now() + 10000,
    };
  }

  private getStoredTokens(): LoginResponse {
    return {
      username: localStorage?.getItem('auth:username') ?? '',
      accessToken: {
        value: localStorage?.getItem('auth:accessToken:value') ?? '',
        expiry:
          localStorage?.getItem('auth:accessToken:expiry') ??
          new Date().toISOString(),
      },
      refreshToken: {
        value: localStorage?.getItem('auth:refreshToken:value') ?? '',
        expiry:
          localStorage?.getItem('auth:refreshToken:expiry') ??
          new Date().toISOString(),
      },
    };
  }

  private async getAuthTokens(): Promise<LoginResponse | null> {
    const storedTokens = this.getStoredTokens();
    const tokenValidity = this.checkAccessTokens();

    if (tokenValidity.accessToken) {
      return storedTokens;
    }

    try {
      if (!tokenValidity.refreshToken) {
        throw new Error('Refresh Token Expired');
      }

      const refreshedTokens = await new Promise<LoginResponse>(
        async (resolve, reject) => {
          const observable = await this.post<LoginResponse>('/auth/refresh', {
            body: {
              accessToken: storedTokens.accessToken.value,
              refreshToken: storedTokens.refreshToken.value,
            },
            skipAuthorization: true,
            asPromise: true,
          });
          observable.subscribe({
            next: ({ data }) => resolve(data),
            error: reject,
          });
        }
      );

      // update local storage
      this.setAuthTokens(refreshedTokens);
      return refreshedTokens;
    } catch (error) {
      console.error('ERROR WHILE REFRESHING TOKENS - ', error);
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        await this.router.navigateByUrl(`/login?redirectTo=${currentPath}`);
      }
      return null;
    }
  }
}
