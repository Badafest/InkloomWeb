import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { TVariant } from '../types';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { v4 as randomUUID } from 'uuid';
import {
  AngularEditorModule,
  AngularEditorConfig,
} from '@kolkov/angular-editor';

@Component({
  selector: 'app-rich-text-input',
  templateUrl: './rich-text-input.component.html',
  styleUrls: ['./rich-text-input.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AngularEditorModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextInputComponent),
      multi: true,
    },
  ],
})
export class RichTextInputComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() id = randomUUID();
  @Input() name = 'rich-text-input';
  @Input() formControlName: string = this.name;
  @Input() label = '';
  @Input() placeholder = this.name || 'Enter text here...';
  @Input() hint = '';
  @Input() variant: TVariant = 'primary';
  editorConfig: AngularEditorConfig = {
    editable: !this.disabled,
    minHeight: '48px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: 'p',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript', 'superscript'],
      ['fontSize', 'fontName', 'textColor'],
      ['indent', 'outdent'],
      ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
      [
        'paragraph',
        'blockquote',
        'removeBlockquote',
        'horizontalLine',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'fontName',
        'heading',
        'justifyLeft',
        'justifyCenter',
        'justifyFull',
        'justifyRight',
      ],
      ['toggleEditorMode', 'clearFormatting'],
      ['backgroundColor'],
    ],
  };

  private _value = '';
  get value(): string {
    return this._value;
  }
  set value(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
      this.onTouched();
    }
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.editorConfig = {
      ...this.editorConfig,
      editable: !isDisabled,
    };
  }
  onContentChange(content: string): void {
    this.value = content;
    this.updateEditorHeight();
  }

  private updateEditorHeight(): void {
    // Wait for next tick to ensure content is rendered
    setTimeout(() => {
      const editorElement = document.querySelector(
        '.angular-editor-textarea'
      ) as HTMLElement;
      if (editorElement) {
        // Reset height to auto to get proper scrollHeight
        editorElement.style.height = 'auto';

        // Get the scroll height and add a small buffer for padding
        const scrollHeight = editorElement.scrollHeight;
        const newHeight = Math.max(48, scrollHeight); // Minimum 200px height

        // Set the new height
        editorElement.style.height = `${newHeight}px`;
      }
    }, 0);
  }
}
