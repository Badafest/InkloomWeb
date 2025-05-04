import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../app/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(protected userService: UserService) {}
  mobileMenuOpen = false;

  routes = computed(() => [
    {
      href: '/',
      label: 'Blogs',
      exact: true,
    },
    ...(this.userService.user() === null
      ? [
          {
            href: '/login',
            label: 'Login',
            exact: true,
          },
        ]
      : [
          {
            href: '/studio',
            label: 'Studio',
            exact: true,
          },
          {
            href: '/account',
            label: 'Account',
            exact: true,
          },
        ]),
  ]);
}
