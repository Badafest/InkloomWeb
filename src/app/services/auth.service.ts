import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Service is registered in root module and available app-wide
})
export class AuthService extends ApiService {
  public async login(email: string, password: string) {
    const loginResponse = await this.post<LoginResponse>('auth/login', {
      body: { email, password },
      skipAuthorization: true,
    });

    loginResponse.subscribe(({ data }) => this.setAuthTokens(data));
    return loginResponse;
  }
}
