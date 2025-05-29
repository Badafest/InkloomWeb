import { Component, Input } from '@angular/core';
import { Block } from '../../app/models/blog';
import LanguageOptions from '../../assets/languages.json';
import { ButtonComponent } from '../button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-blog-content-block',
  standalone: true,
  imports: [ButtonComponent, FontAwesomeModule],
  templateUrl: './blog-content-block.component.html',
  styleUrl: './blog-content-block.component.css',
})
export class BlogContentBlockComponent {
  @Input() block: Block = null!;

  copyingCode = false;

  faOk = faCheck;
  faCopy = faClipboard;

  languages = LanguageOptions;
  getLanguageName(value: string) {
    return (
      this.languages.find((option) => option.value === value)?.label ??
      'Plain Text'
    );
  }

  handleCopyCode(block: Block) {
    if (block.type !== 'code') {
      throw new Error('Invalid Block Copied');
    }
    this.copyingCode = true;
    navigator.clipboard.writeText(block.content ?? '').then(() => {
      setTimeout(() => {
        this.copyingCode = false;
      }, 300);
    });
  }
}
