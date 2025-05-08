import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TButtonType, TVariant } from '../types';
import { CommonModule } from '@angular/common';
import { v4 as randomUUID } from 'uuid';

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
  @Input() disabled: boolean = false;
  @Input() classes: string = '';
  @Input() tooltip: string = '';
  @Input() title: string = this.tooltip;

  showTooltip: boolean = false;
}
