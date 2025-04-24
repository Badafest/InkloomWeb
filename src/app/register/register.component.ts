import { Component, effect, signal } from '@angular/core';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faSpinner,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { TVariant } from '../../ui/types';
import { ButtonComponent } from '../../ui/button/button.component';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputGroupComponent,
    ButtonComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  faMailIcon = faEnvelope;
  faLockIcon = faLock;
  faEyeIcon = faEye;
  faLoading = faSpinner;
  faUserIcon = faUserAlt;

  ssoRegisterOptions = [
    {
      type: 'google',
      icon: faGoogle,
      label: 'Register with Google',
      action: () => this.authService.signInWithGoogle('/login', true),
    },
    {
      type: 'facebook',
      icon: faFacebookF,
      label: 'Register with Facebook',
      action: () => this.authService.signInWithFacebook('/login', true),
    },
  ];

  passwordType = 'password';

  emailVariant: TVariant = 'primary';
  passwordVariant: TVariant = 'primary';
  usernameVariant: TVariant = 'primary';

  registerForm: FormGroup;
  registerLoading = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', this.usernameValidator],
      email: ['', this.emailValidator],
      password: ['', this.passwordValidator],
    });
    effect(
      () => {
        const user = this.userService.user();
        if (user !== null) {
          this.router.navigateByUrl('/dashboard');
        }
      },
      { allowSignalWrites: true }
    );
  }

  async onSubmit() {
    const username = this.registerForm.get('username')?.getRawValue();
    const usernameResponse = await this.userService.checkUsername(username);

    usernameResponse.subscribe({
      next: async ({ data: usernameAvailable }) => {
        if (!usernameAvailable) {
          this.registerForm
            .get('username')
            ?.setErrors({ username: 'Username is already taken' });
          this.usernameVariant = 'danger';
          return;
        }
        const email = this.registerForm.get('email')?.getRawValue();
        const password = this.registerForm.get('password')?.getRawValue();
        this.registerLoading.set(true);

        const registerResponse = await this.authService.register(
          username,
          email,
          password,
          '/login'
        );
        registerResponse.subscribe({
          complete: () => {
            this.registerLoading.set(false);
          },
          error: () => {
            this.registerLoading.set(false);
          },
        });
      },
    });
  }

  handleShowHidePassword() {
    this.passwordType =
      { password: 'text', text: 'password' }[this.passwordType] || 'password';
    this.faEyeIcon = this.passwordType === 'password' ? faEye : faEyeSlash;
  }

  usernameValidator = (control: AbstractControl) => {
    const value = control.value;
    const isValid = value.length && /^[a-z0-9]+$/.test(value);
    this.usernameVariant = value ? (isValid ? 'success' : 'danger') : 'primary';
    if (isValid) {
      return null;
    }
    return {
      username: value
        ? 'Username can contain lowercase alphabets (a-z)\nand digits (0-9) only'
        : 'Username is required',
    };
  };

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
    const { eightChars, oneUpperCase, oneLowerCase, oneNumber } = {
      eightChars: value.length > 7,
      oneUpperCase: /[A-Z]/.test(value),
      oneLowerCase: /[a-z]/.test(value),
      oneNumber: /[0-9]/.test(value),
    };
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
