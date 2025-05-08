import {
  Component,
  effect,
  ElementRef,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { InputGroupComponent } from '../input-group/input-group.component';
import { ButtonComponent } from '../button/button.component';
import { TVariant } from '../types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../app/services/notification.service';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [InputGroupComponent, ButtonComponent, FontAwesomeModule],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.css',
})
export class ImageInputComponent {
  imageUrl = signal<string>('');
  imageFile = signal<File | null>(null);
  imageCaption = signal<string>('');

  faRemoveImage = faClose;

  @Input() defaultImageUrl = '';
  @Input() defaultImageCaption = '';
  @Input() showCaption = false;
  @Input() hint = 'Select an image or enter a URL';
  @Input() variant: TVariant = 'primary';
  @Input() label = '';
  @Input() name = 'image';
  @Input() onImageChange: (url: string, file: File | null) => void = () => {};
  @Input() onCaptionChange: (caption: string) => void = () => {};

  @ViewChild('imageField') imageField: ElementRef<HTMLInputElement> = null!;

  constructor(private notificationService: NotificationService) {
    effect(
      () => {
        this.imageUrl.set(this.defaultImageUrl ?? '');
        this.imageCaption.set(this.defaultImageCaption ?? '');
      },
      { allowSignalWrites: true }
    );
  }

  handleImageChange: EventListener = (event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.notificationService.addNotification(
        'Image Too Large',
        'Please compress the image or choose another less than 2MB',
        'danger'
      );
      return;
    }
    URL.revokeObjectURL(this.imageUrl());

    this.hint = '';
    this.variant = 'success';

    const newUrl = URL.createObjectURL(file);
    this.imageFile.set(file);
    this.imageUrl.set(newUrl);

    this.onImageChange(newUrl, file);
  };

  handleUrlChange: EventListener = (event) => {
    const input = event.target as HTMLInputElement;
    const url = input.value;
    if (url) {
      URL.revokeObjectURL(this.imageUrl());
      this.hint = '';
      this.variant = 'success';
      this.imageUrl.set(url);
      this.imageFile.set(null);
      this.onImageChange(url, null);
    } else {
      this.hint = 'Please enter a valid URL';
      this.variant = 'danger';
    }
  };

  handleCaptionChange: EventListener = (event) => {
    const input = event.target as HTMLInputElement;
    const caption = input.value;
    this.imageCaption.set(caption);
    this.onCaptionChange(caption);
  };

  clearImage = () => {
    this.imageFile.set(null);
    this.imageUrl.set('');
    this.imageField.nativeElement.value = '';
    this.onImageChange('', null);
  };
}
