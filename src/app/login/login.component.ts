import {
  Component,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faClose,
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
import { isPlatformBrowser } from '@angular/common';
import { SsoAuthType } from '../models/user';

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
  faLoading = faSpinner;
  faCloseIcon = faClose;
  faNextIcon = faArrowRight;

  @ViewChild('magicLoginDialog')
  magicLoginDialog!: ElementRef<HTMLDialogElement>;

  closeMagicLoginDialog = () => {
    this.magicLoginDialog.nativeElement.close();
  };

  openMagicLoginDialog = () => {
    this.magicLoginDialog.nativeElement.showModal();
  };

  queryParams = signal<Record<string, string>>({});

  ssoLoginOptions = [
    {
      type: 'google',
      icon: faGoogle,
      label: 'Sign in with Google',
      action: () =>
        this.authService.signInWithGoogle(
          this.queryParams()['redirectTo'] ?? '/studio'
        ),
    },
    {
      type: 'facebook',
      icon: faFacebookF,
      label: 'Sign in with Facebook',
      action: () =>
        this.authService.signInWithFacebook(
          this.queryParams()['redirectTo'] ?? '/studio'
        ),
    },
    {
      type: 'mail',
      icon: faEnvelope,
      label: 'Sign in with Email',
      action: () => this.openMagicLoginDialog(),
    },
  ];

  passwordType = 'password';

  emailVariant: TVariant = 'primary';
  passwordVariant: TVariant = 'primary';

  loginForm: FormGroup;
  loginLoading = signal(false);

  magicLoginForm: FormGroup;

  _platformId = inject(PLATFORM_ID);

  constructor(
    private formBuilder: FormBuilder,
    protected authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', this.emailValidator],
      password: ['', this.passwordValidator],
    });

    this.magicLoginForm = this.formBuilder.group({
      email: ['', this.emailValidator],
    });
    effect(
      () => {
        this.route.queryParams.subscribe((params) =>
          this.queryParams.set(params)
        );
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      const user = this.userService.user();
      if (user !== null) {
        this.router.navigateByUrl(
          this.queryParams()['redirectTo'] ?? '/studio'
        );
      }
    });

    effect(() => {
      if (isPlatformBrowser(this._platformId)) {
        const type = this.queryParams()['type'];
        if (type === 'email') {
          this.openMagicLoginDialog();
        }
      }
    });
  }

  async onLoginFormSubmit() {
    const email = this.loginForm.get('email')?.getRawValue();
    const password = this.loginForm.get('password')?.getRawValue();
    this.loginLoading.set(true);

    const loginResponse = await this.authService.login(
      email,
      password,
      this.queryParams()['redirectTo'] ?? '/studio'
    );
    loginResponse.subscribe({
      complete: () => {
        this.loginLoading.set(false);
      },
      error: () => {
        this.loginLoading.set(false);
      },
    });
  }

  async onSsoLogin(type: SsoAuthType) {
    this.loginLoading.set(true);
    await (type === 'GOOGLE'
      ? this.authService.signInWithGoogle(
          this.queryParams()['redirectTo'] ?? '/studio'
        )
      : this.authService.signInWithFacebook(
          this.queryParams()['redirectTo'] ?? '/studio'
        ));
  }

  async onMagicLoginFormSubmit() {
    const email = this.magicLoginForm.get('email')?.getRawValue();
    this.loginLoading.set(true);

    const loginResponse = await this.authService.magicLogin(
      email,
      null,
      this.queryParams()['redirectTo'] ?? '/studio'
    );
    loginResponse.subscribe({
      next: () => {
        this.closeMagicLoginDialog();
        this.router.navigateByUrl('/');
      },
      complete: () => {
        this.loginLoading.set(false);
      },
      error: () => {
        this.loginLoading.set(false);
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
