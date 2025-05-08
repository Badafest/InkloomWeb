import {
  Component,
  computed,
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
import { ImageInputComponent } from '../../ui/image-input/image-input.component';

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
    ImageInputComponent,
  ],
})
export class AccountComponent {
  user = this.userService.user;
  isEditing = false;

  updatedAccount = signal<Partial<User>>({});

  avatarImageUrl = computed(() => this.updatedAccount().avatar ?? '');

  aboutHint = '';
  aboutVariant: TVariant = 'primary';

  nameHint = '';
  nameVariant: TVariant = 'primary';

  @ViewChild('accountDeleteDialog')
  accountDeleteDialog!: ElementRef<HTMLDialogElement>;

  showUpdateView = false;

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
        this.nameVariant =
          (this.user()?.displayName ?? '')?.length > 0 ? 'primary' : 'danger';
      },
      { allowSignalWrites: true }
    );
  }

  logout = () => {
    this.userService.logout();
  };

  handleAvatarChange = (url: string, file: File | null) => {
    this.updatedAccount.update((prev) => ({
      ...prev,
      avatarImage: file ?? undefined,
      avatar: url,
    }));
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

  toggleUpdateView = () => {
    this.showUpdateView = !this.showUpdateView;
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
        this.showUpdateView = false;
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
