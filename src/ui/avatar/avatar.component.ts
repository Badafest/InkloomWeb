import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() size: number = 120;
  @Input() username: string = 'Anonymous';
  @Input() image: string | undefined;

  backgroundColor = [
    '#8B0000', // Dark Red
    '#00008B', // Dark Blue
    '#006400', // Dark Green
    '#4B0082', // Dark Purple
    '#2F4F4F', // Dark Gray
    '#654321', // Dark Brown
    '#008B8B', // Dark Cyan
    '#8B4513', // Dark Orange
    '#800080', // Dark Magenta
    '#000000', // Black
  ][this.username.charCodeAt(0) % 10];
}
