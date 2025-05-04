import { isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-magic-login',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './magic-login.component.html',
  styleUrl: './magic-login.component.css',
})
export class MagicLoginComponent {
  faLoading = faSpinner;

  verifying = false;
  statusMessage = 'Verifying login link ...';

  queryParams = signal<Record<string, string>>({});
  platformId = inject(PLATFORM_ID);

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    effect(
      () => {
        this.route.queryParams.subscribe((params) =>
          this.queryParams.set(params)
        );
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }
        const token = this.queryParams()['token'];
        if (!token) {
          this.statusMessage = 'Token is missing ...';
          return;
        }
        const redirectTo = this.queryParams()['redirectTo'] ?? '/studio';

        this.verifying = true;
        this.authService
          .magicLogin(null, token, redirectTo)
          .then((response) => {
            response.subscribe({
              next: () => {
                this.statusMessage =
                  'Verification successful. Redirecting now ...';
              },
              error: () => {
                this.verifying = false;
                this.statusMessage =
                  'Verification failed. Please generate a new link ...';
              },
              complete: () => {
                this.verifying = false;
              },
            });
          });
      },
      { allowSignalWrites: true }
    );
  }
}
