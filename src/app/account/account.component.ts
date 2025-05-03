import {
  Component,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import {
  faCircleCheck,
  faClose,
  faPencilAlt,
  faPowerOff,
  faSave,
  faTrashAlt,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
  ],
})
export class AccountComponent {
  user = this.userService.user;
  isEditing = false;

  updatedAccount = signal<Partial<User>>({});
  avatarImageUrl = '';

  aboutHint = '';
  aboutVariant: TVariant = 'primary';

  avatarHint = '';
  avatarVariant: TVariant = 'primary';

  nameHint = '';
  nameVariant: TVariant = 'primary';

  @ViewChild('accountDeleteDialog')
  accountDeleteDialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('accountUpdateDialog')
  accountUpdateDialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('avatarImageField')
  avatarImageField!: ElementRef<HTMLInputElement>;

  faWarning = faWarning;
  faLogout = faPowerOff;
  faVerified = faCircleCheck;
  faEditIcon = faPencilAlt;
  faDeleteIcon = faTrashAlt;
  faClose = faClose;
  faSave = faSave;

  constructor(private userService: UserService) {
    effect(
      () => {
        this.updatedAccount.set({
          about: this.user()?.about,
          avatar: this.user()?.avatar,
          displayName: this.user()?.displayName,
          avatarImage: undefined,
        });
        this.avatarImageUrl = this.user()?.avatar ?? '';
        this.nameVariant =
          (this.user()?.displayName ?? '')?.length > 0 ? 'primary' : 'danger';
      },
      { allowSignalWrites: true }
    );
  }

  logout = () => {
    this.userService.logout();
  };

  handleAvatarChange: EventListener = (event) => {
    this.avatarHint = '';
    this.avatarVariant = 'success';
    const updatedAvatar = (event.target as HTMLInputElement).value;
    URL.revokeObjectURL(this.avatarImageUrl);
    this.updatedAccount.update((prev) => ({
      ...prev,
      avatar: updatedAvatar,
      avatarImage: undefined,
    }));
    this.avatarImageUrl = updatedAvatar;
  };

  handleAvatarImageChange: EventListener = (event) => {
    const inputFiles = (event.target as HTMLInputElement).files;
    if (!inputFiles || inputFiles?.length === 0) {
      return;
    }
    const avatarImage = inputFiles[0];
    if (avatarImage.size > 2 * 1024 * 1024) {
      this.avatarHint =
        'Please compress the avatar image or choose another less than 2MB in size';
      this.avatarVariant = 'danger';
    } else {
      this.avatarHint = '';
      this.avatarVariant = 'success';
    }
    URL.revokeObjectURL(this.avatarImageUrl);
    this.updatedAccount.update((prev) => ({
      ...prev,
      avatarImage: inputFiles[0],
      avatar: '',
    }));
    this.avatarImageUrl = URL.createObjectURL(inputFiles[0]);
  };

  clearAvatar = () => {
    this.updatedAccount.update((prev) => ({
      ...prev,
      avatarImage: undefined,
      avatar: '',
    }));
    this.avatarImageUrl = '';
    this.avatarHint = '';
    this.avatarVariant = 'primary';
  };

  handleAboutChange: EventListener = (event) => {
    const updatedAbout = (event.target as HTMLTextAreaElement).value;
    this.updatedAccount.update((prev) => ({ ...prev, about: updatedAbout }));
    const isValid = updatedAbout?.length <= 512;
    this.aboutHint =
      updatedAbout?.length > 0 ? updatedAbout.length + ' characters' : '';
    this.aboutVariant = updatedAbout
      ? isValid
        ? 'success'
        : 'danger'
      : 'primary';
  };

  handleNameChange: EventListener = (event) => {
    const updatedName = (event.target as HTMLTextAreaElement).value;
    this.updatedAccount.update((prev) => ({
      ...prev,
      displayName: updatedName,
    }));
    const isValid = updatedName?.length > 0;
    this.nameHint = isValid ? '' : 'Name is required';
    this.nameVariant = isValid ? 'success' : 'danger';
  };

  openAccountUpdateDialog = () => {
    this.accountUpdateDialog.nativeElement.showModal();
  };

  closeAccountUpdateDialog = () => {
    this.accountUpdateDialog.nativeElement.close();
  };

  async updateAccount(): Promise<void> {
    this.isEditing = true;
    const userResponse = await this.userService.updateUser(
      this.updatedAccount()
    );
    userResponse.subscribe({
      error: () => {
        this.isEditing = false;
      },
      complete: () => {
        this.isEditing = false;
        this.closeAccountUpdateDialog();
      },
    });
  }

  openAccountDeleteDialog = () => {
    this.accountDeleteDialog.nativeElement.showModal();
  };

  closeAccountDeleteDialog = () => {
    this.accountDeleteDialog.nativeElement.close();
  };

  async deleteAccount(): Promise<void> {
    this.isEditing = true;
    const userResponse = await this.userService.deleteUser();
    userResponse.subscribe({
      error: () => {
        this.isEditing = false;
        this.closeAccountDeleteDialog();
      },
      complete: () => {
        this.isEditing = false;
        this.closeAccountDeleteDialog();
      },
    });
  }
}
