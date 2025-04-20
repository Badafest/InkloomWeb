import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RootComponent } from './root/root.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountComponent } from './account/account.component';
import { MagicLoginComponent } from './magic-login/magic-login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'magic-login', component: MagicLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', component: RootComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
