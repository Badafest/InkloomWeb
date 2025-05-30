import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  @Input() gridPattern = [[1]];

  @Input() gridHeight = 200;

  protected get grid() {
    return this.gridPattern.map((widths) => widths.map((w) => `${w * 100}%`));
  }

  protected get padding() {
    return `${this.gridHeight / 2}px 0px`;
  }
}
