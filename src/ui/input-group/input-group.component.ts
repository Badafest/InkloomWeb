import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TVariant } from '../types';

@Component({
  selector: 'app-input-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-group.component.html',
  styleUrl: './input-group.component.css',
})
export class InputGroupComponent {
  @Input() id = 'randomId';
  @Input() name = 'input';
  @Input() label = this.name || 'Label';
  @Input() type = 'text';
  @Input() placeholder = this.name || 'placeholder';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() color = 'red-500';
  @Input() background = 'white';
  @Input() variant: TVariant = 'primary';
  @Input() onChange: EventListener = () => {};
}
