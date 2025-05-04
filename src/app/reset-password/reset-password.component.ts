import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TVariant } from '../../ui/types';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputGroupComponent,
    FontAwesomeModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  step = 1;
  otpDigits: string[] = Array(6).fill('');
  requestingOtp = false;
  submitting = false;
  error = '';
  emailVariant: TVariant = 'primary';
  passwordVariant: TVariant = 'primary';
  confirmPasswordVariant: TVariant = 'primary';
  faMailIcon = faEnvelope;
  faLockIcon = faLock;

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faEyeIcon = faEye;
  faConfirmEyeIcon = faEye;

  resetForm: FormGroup;

  passwordType = 'password';
  confirmPasswordType = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.resetForm = this.formBuilder.group({
      email: ['', this.emailValidator],
      password: ['', this.passwordValidator],
      confirmPassword: ['', this.confirmPasswordValidator],
    });
  }

  get otp(): string {
    return this.otpDigits.join('');
  }

  get isOtpValid(): boolean {
    return /^[0-9A-Z]{6}$/.test(this.otp);
  }

  get canSubmit(): boolean {
    return (
      this.isOtpValid &&
      !['email', 'password', 'confirmPassword'].some(
        (f) => this.resetForm.get(f)?.getError(f)?.length > 0
      )
    );
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

    // confirm password validation
    const confirmedValue = this.resetForm?.get('confirmPassword')?.value;
    const isConfirmValid = confirmedValue === value;
    this.confirmPasswordVariant = confirmedValue
      ? isConfirmValid
        ? 'success'
        : 'danger'
      : 'primary';

    if (isValid && isConfirmValid) {
      return {
        password: null,
        confirmPassword: null,
      };
    }

    const errors: any = {};

    if (!isValid) {
      errors['password'] = value
        ? `Password must contain at least\n ${
            eightChars ? '✓' : '✕ '
          } 8 characters \n ${oneUpperCase ? '✓' : '✕ '} 1 uppercase letter\n ${
            oneLowerCase ? '✓' : '✕ '
          } 1 lowercase letter \n ${oneNumber ? '✓' : '✕ '} 1 number`
        : 'Password is required';
    }

    if (!isConfirmValid) {
      errors['confirmPassword'] = 'Passwords do not match';
    }

    return errors;
  };

  confirmPasswordValidator = (control: AbstractControl) => {
    const value = control.value;

    const isValid = this.resetForm?.get('password')?.value === value;

    this.confirmPasswordVariant = value
      ? isValid
        ? 'success'
        : 'danger'
      : 'primary';

    return isValid
      ? null
      : {
          confirmPassword: 'Passwords do not match',
        };
  };

  async requestOtp() {
    this.requestingOtp = true;
    this.error = '';
    // Simulate async OTP request
    const email = this.resetForm?.get('email');
    if (!email?.value || email?.getError('email')?.length > 0) {
      this.error = 'Email is not valid';
      return;
    }
    const forgotResponse = await this.authService.forgotPassword(email.value);
    forgotResponse.subscribe({
      error: () => {
        this.requestingOtp = false;
      },
      complete: () => {
        this.requestingOtp = false;
        this.step = 2;
      },
    });
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.otpDigits[index] = value;
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp${index + 1}`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp${index - 1}`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = pasted
      .toUpperCase()
      .replace(/[^0-9A-Z]/g, '')
      .slice(0, 6)
      .split('');
    digits.forEach((digit, idx) => {
      if (idx < 6) {
        this.otpDigits[idx] = digit;
        const input = document.getElementById(`otp${idx}`) as HTMLInputElement;
        if (input) input.value = digit;
      }
    });
    // Focus the last filled input or the last box
    const lastIdx = Math.min(digits.length, 5);
    const lastInput = document.getElementById(
      `otp${lastIdx}`
    ) as HTMLInputElement;
    if (lastInput) lastInput.focus();
  }

  async onSubmit() {
    if (!this.canSubmit) {
      this.error = 'Please fill all fields correctly.';
      return;
    }
    this.submitting = true;
    this.error = '';

    const email = this.resetForm?.get('email')?.value ?? '';
    const password = this.resetForm?.get('password')?.value ?? '';
    const resetResponse = await this.userService.changePassword(
      email,
      this.otp,
      password
    );
    resetResponse.subscribe({
      error: () => {
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
