import { Component, effect, signal } from '@angular/core';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faSpinner,
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
import { ActivatedRoute, Router } from '@angular/router';

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
  faLoading = faSpinner;

  passwordType = 'password';

  emailVariant: TVariant = 'primary';
  passwordVariant: TVariant = 'primary';

  loginForm: FormGroup;
  loginLoading: boolean = false;

  queryParams = signal<Record<string, string>>({});

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', this.emailValidator],
      password: ['', this.passwordValidator],
    });
    effect(
      () => {
        this.route.queryParams.subscribe((params) =>
          this.queryParams.set(params)
        );
        const user = this.userService.user();
        if (user !== null) {
          this.router.navigateByUrl('/account');
        }
      },
      { allowSignalWrites: true }
    );
  }

  async onSubmit() {
    const email = this.loginForm.get('email')?.getRawValue();
    const password = this.loginForm.get('password')?.getRawValue();
    this.loginLoading = true;

    const loginResponse = await this.authService.login(
      email,
      password,
      this.queryParams()['redirectTo'] ?? '/dashboard'
    );
    loginResponse.subscribe({
      complete: () => {
        this.loginLoading = false;
      },
      error: () => {
        this.loginLoading = false;
      },
    });
  }

  handleShowHidePassword() {
    this.passwordType =
      { password: 'text', text: 'password' }[this.passwordType] || 'password';
    this.faEyeIcon = this.passwordType === 'password' ? faEye : faEyeSlash;
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
