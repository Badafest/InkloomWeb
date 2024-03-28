import { Component, Input } from '@angular/core';
import { TButtonType, TVariant } from '../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() variant: TVariant = 'primary';
  @Input() type: TButtonType = 'button';
  @Input() onClick: EventListener = () => {};
  @Input() disabled: boolean = false;
  @Input() classes: string = '';
}
