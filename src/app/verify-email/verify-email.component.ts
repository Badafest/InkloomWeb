import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { UserService } from '../services/user.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [FormsModule, ButtonComponent, FontAwesomeModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  otpDigits: string[] = Array(8).fill('');
  error = '';
  isValid = false;
  verifying = false;
  // Combine the digits into a single string
  get otp(): string {
    return this.otpDigits.join('');
  }

  faLoading = faSpinner;

  private _userService = inject(UserService);
  private _platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.verifying = true;
      this._userService.verifyEmail().then((verifyResponse) => {
        verifyResponse.subscribe({
          error: () => {
            this.verifying = false;
          },
          complete: () => {
            this.verifying = false;
          },
        });
      });
    }
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
    this.isValid = /^[0-9a-z]{6}$/.test(this.otp);
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
    this.isValid = /^[0-9A-Z]{6}$/.test(this.otp);
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
    this.isValid = /^[0-9A-Z]{6}$/.test(this.otp);
    // Focus the last filled input or the last box
    const lastIdx = Math.min(digits.length, 5);
    const lastInput = document.getElementById(
      `otp${lastIdx}`
    ) as HTMLInputElement;
    if (lastInput) lastInput.focus();
  }

  async onSubmit() {
    if (!this.isValid) {
      this.error = 'Please enter a valid 6-digit code.';
      return;
    }
    const verifyResponse = await this._userService.verifyEmail(this.otp);
    verifyResponse.subscribe({
      error: () => {
        this.verifying = false;
      },
      complete: () => {
        this.verifying = false;
      },
    });
  }
}
