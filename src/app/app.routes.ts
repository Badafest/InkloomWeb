import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RootComponent } from './root/root.component';
import { StudioComponent } from './studio/studio.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountComponent } from './account/account.component';
import { MagicLoginComponent } from './magic-login/magic-login.component';
import { authGuard } from './guards/auth.guard';
import { Oauth2Component } from './oauth2/oauth2.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

export const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'magic-login', component: MagicLoginComponent },
  { path: 'oauth2', component: Oauth2Component },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', component: RootComponent },
  {
    path: 'studio',
    component: StudioComponent,
    canActivate: [authGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
