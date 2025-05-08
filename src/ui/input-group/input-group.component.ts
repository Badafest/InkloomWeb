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

  rows = 1;
  onChangeForTextArea: EventListener = (event) => {
    this.updateRows(event);
    this.onChange(event);
  };

  updateRows: EventListener = (event) => {
    const target = event.target as HTMLTextAreaElement;

    const style = window.getComputedStyle(target);
    const lineHeight = parseFloat(style.lineHeight || '16');
    const paddingTop = parseFloat(style.paddingTop || '0');
    const paddingBottom = parseFloat(style.paddingBottom || '0');
    const borderTop = parseFloat(style.borderTopWidth || '0');
    const borderBottom = parseFloat(style.borderBottomWidth || '0');
    const totalVertical = paddingTop + paddingBottom + borderTop + borderBottom;

    // scrollHeight includes padding but not borders, so we add borders
    const contentHeight = target.scrollHeight + borderTop + borderBottom;
    const rows = Math.round((contentHeight - totalVertical) / lineHeight);

    this.rows = Math.max(1, rows);
  };
}
