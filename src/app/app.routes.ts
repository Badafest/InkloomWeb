import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RootComponent } from './root/root.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: RootComponent },
  { path: '**', component: NotFoundComponent },
];
