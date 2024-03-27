import { Component } from '@angular/core';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { TVariant } from '../../ui/types';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputGroupComponent, ButtonComponent, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  faMailIcon = faEnvelope;
  faLockIcon = faLock;
  passwordType = 'password';

  emailVariant: TVariant = 'primary';
  passwordVariant: TVariant = 'primary';

  faEyeIcon = faEye;

  emailHint = '';
  passwordHint = '';

  handleShowHidePassword() {
    this.passwordType =
      { password: 'text', text: 'password' }[this.passwordType] || 'password';
    this.faEyeIcon = this.passwordType === 'password' ? faEye : faEyeSlash;
  }

  isEmailValid(value: string) {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
      value
    );
  }

  isPasswordValid(value: string) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/.test(value);
  }

  handleEmailChange = (event: Event) => {
    const value = (event.target as HTMLInputElement)?.value;
    const isValid = !value || this.isEmailValid(value);
    this.emailVariant = value ? (isValid ? 'success' : 'danger') : 'primary';
    this.emailHint = isValid
      ? ''
      : 'Email address looks like "example@mail.com"';
  };

  handlePasswordChange = (event: Event) => {
    const value = (event.target as HTMLInputElement)?.value;
    const isValid = !value || this.isPasswordValid(value);
    this.passwordVariant = value ? (isValid ? 'success' : 'danger') : 'primary';
    this.passwordHint = isValid
      ? ''
      : 'Password must contain at least:\n - 8 characters \n - 1 uppercase letter\n - 1 lowercase letter \n - 1 number';
  };
}
