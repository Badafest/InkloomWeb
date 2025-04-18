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
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InputGroupComponent,
    ButtonComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  faMailIcon = faEnvelope;
  faLockIcon = faLock;
  faEyeIcon = faEye;
  faGoogleIcon = faGoogle;
  faFacebookIcon = faFacebookF;

  passwordType = 'password';

  emailVariant: TVariant = 'primary';
  passwordVariant: TVariant = 'primary';

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', this.emailValidator],
      password: ['', this.passwordValidator],
    });
  }

  onSubmit() {
    const email = this.loginForm.get('email')?.getRawValue();
    const password = this.loginForm.get('password')?.getRawValue();
    this.authService.login(email, password);
  }

  handleShowHidePassword() {
    this.passwordType =
      { password: 'text', text: 'password' }[this.passwordType] || 'password';
    this.faEyeIcon = this.passwordType === 'password' ? faEye : faEyeSlash;
  }

  isPasswordValid(value: string) {
    return {
      eightChars: value.length > 7,
      oneUpperCase: /[A-Z]/.test(value),
      oneLowerCase: /[a-z]/.test(value),
      oneNumber: /[0-9]/.test(value),
    };
  }

  emailValidator = (control: AbstractControl) => {
    const value = control.value;
    const isValid = value.length && !Validators.email(control)?.['email'];
    this.emailVariant = value ? (isValid ? 'success' : 'danger') : 'primary';
    if (isValid) {
      return null;
    }
    return {
      email: value
        ? 'Email address looks like "example@mail.com"'
        : 'Email address is required',
    };
  };

  passwordValidator = (control: AbstractControl) => {
    const value = control.value;
    const { eightChars, oneUpperCase, oneLowerCase, oneNumber } =
      this.isPasswordValid(value);
    const isValid =
      value && eightChars && oneUpperCase && oneLowerCase && oneNumber;
    this.passwordVariant = value ? (isValid ? 'success' : 'danger') : 'primary';

    if (isValid) {
      return null;
    }

    return {
      password: value
        ? `Password must contain at least\n ${
            eightChars ? '✓' : '✕ '
          } 8 characters \n ${oneUpperCase ? '✓' : '✕ '} 1 uppercase letter\n ${
            oneLowerCase ? '✓' : '✕ '
          } 1 lowercase letter \n ${oneNumber ? '✓' : '✕ '} 1 number`
        : 'Password is required',
    };
  };
}
