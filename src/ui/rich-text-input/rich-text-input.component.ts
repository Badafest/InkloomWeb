import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { TVariant } from '../types';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { v4 as randomUUID } from 'uuid';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-rich-text-input',
  templateUrl: './rich-text-input.component.html',
  styleUrls: ['./rich-text-input.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextInputComponent),
      multi: true,
    },
  ],
  host: {
    '(input)': '_onChange($event.target.value)',
    '(blur)': '_onTouch()',
  },
})
export class RichTextInputComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() value: string = '';
  @Input() onChange = (_: string) => {};
  @Input() disabled: boolean = false;
  @Input() id = randomUUID();
  @Input() name = 'rich-text-input';
  @Input() formControlName: string = this.name;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() variant: TVariant = 'primary';
  @Input() autoFocus: boolean = true;

  focussed = false;

  // Custom Quill toolbar to only show Bold, Italic, Underline, Strikethrough, Ordered/Unordered list, and Link
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  @ViewChild('quillEditor') quillEditor?: QuillEditorComponent;

  _onChange: (value: string) => void = () => {};
  _onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    if (this.autoFocus && this.quillEditor) {
      setTimeout(() => {
        this.quillEditor?.quillEditor?.focus();
      }, 0);
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onContentChange(content: string): void {
    this.value = content;
    this.onChange(content);
    this._onChange(content);
  }

  focus() {
    setTimeout(() => {
      this.quillEditor?.quillEditor?.focus();
    });
  }
}
