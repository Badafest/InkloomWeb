import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { isPlatformServer } from '@angular/common';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // skip check in server
  if (isPlatformServer(platformId)) {
    return true;
  }
  if (userService.isAuthenticated()) {
    return true;
  }
  router.navigateByUrl('/login'); // Redirect if not authenticated
  return false;
};
