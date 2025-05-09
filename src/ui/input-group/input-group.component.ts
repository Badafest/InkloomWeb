import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { TVariant } from '../types';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { v4 as randomUUID } from 'uuid';

@Component({
  selector: 'app-input-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-group.component.html',
  styleUrl: './input-group.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGroupComponent),
      multi: true,
    },
  ],
  host: {
    '(input)': '_onChange($event.target.value)',
    '(blur)': '_onTouch()',
  },
})
export class InputGroupComponent implements ControlValueAccessor {
  _onTouch = () => {};
  _onChange = () => {};

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input() value: string = '';
  @Input() onChange: EventListener = () => {};
  @Input() disabled: boolean = false;
  @Input() id = randomUUID();
  @Input() name = 'input';
  @Input() formControlName: string = this.name;
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = this.name || 'placeholder';
  @Input() hint = '';
  @Input() variant: TVariant = 'primary';
}
