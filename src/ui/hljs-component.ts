import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import go from 'highlight.js/lib/languages/go';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import rust from 'highlight.js/lib/languages/rust';
import perl from 'highlight.js/lib/languages/perl';
import scala from 'highlight.js/lib/languages/scala';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// import 'highlight.js/styles/dark.min.css';
import 'highlight.js/styles/default.min.css';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [],
  template: '',
})
export abstract class HljsComponent {
  protected readonly platformId = inject(PLATFORM_ID);
  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      // Register only the languages we use
      hljs.registerLanguage('javascript', javascript);
      hljs.registerLanguage('typescript', typescript);
      hljs.registerLanguage('python', python);
      hljs.registerLanguage('java', java);
      hljs.registerLanguage('cpp', cpp);
      hljs.registerLanguage('csharp', csharp);
      hljs.registerLanguage('markup', xml);
      hljs.registerLanguage('html', xml);
      hljs.registerLanguage('css', css);
      hljs.registerLanguage('json', json);
      hljs.registerLanguage('sql', sql);
      hljs.registerLanguage('bash', bash);
      hljs.registerLanguage('yaml', yaml);
      hljs.registerLanguage('markdown', markdown);
      hljs.registerLanguage('go', go);
      hljs.registerLanguage('php', php);
      hljs.registerLanguage('ruby', ruby);
      hljs.registerLanguage('swift', swift);
      hljs.registerLanguage('kotlin', kotlin);
      hljs.registerLanguage('rust', rust);
      hljs.registerLanguage('perl', perl);
      hljs.registerLanguage('scala', scala);
      hljs.registerLanguage('docker', dockerfile);
    });
  }

  ngAfterViewChecked() {
    // Highlight all code blocks in view mode
    if (typeof window !== 'undefined') {
      const codeBlocks = document.querySelectorAll(
        'pre code.hljs:not([data-highlighted="yes"])'
      );
      codeBlocks.forEach((block: Element) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }
}
