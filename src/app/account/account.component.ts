import { Component, effect } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import {
  faCircleCheck,
  faPowerOff,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TVariant } from '../../ui/types';

@Component({
  standalone: true,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  imports: [
    AvatarComponent,
    FaIconComponent,
    InputGroupComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
})
export class AccountComponent {
  user = this.userService.user; // Signal for reactivity
  isEditing = false;

  accountForm: FormGroup = new FormGroup([]);

  aboutHint = '';
  aboutVariant: TVariant = 'primary';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    effect(() => {
      this.accountForm = this.formBuilder.group({
        avatar: [this.user()?.avatar],
        about: [this.user()?.about, this.aboutValidator],
      });
    });
  }

  faWarning = faWarning;
  faLogout = faPowerOff;
  faVerified = faCircleCheck;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  logout = () => {
    this.userService.logout();
  };

  aboutValidator = (control: AbstractControl) => {
    const value = control.value;
    const isValid = value?.length <= 512;
    this.aboutHint = value?.length > 0 ? value.length + ' characters' : '';
    this.aboutVariant = value ? (isValid ? 'success' : 'danger') : 'primary';
    if (isValid) {
      return null;
    }
    return { maxLength: true };
  };

  async saveChanges(): Promise<void> {
    const updatedUser: Partial<User> = {
      about: this.accountForm.get('about')?.value,
      avatar: this.accountForm.get('avatar')?.value,
    };

    const userResponse = await this.userService.updateUser(updatedUser);
    userResponse.subscribe({
      error: () => {
        this.isEditing = false;
      },
      complete: () => {
        this.isEditing = false;
      },
    });
  }
}
