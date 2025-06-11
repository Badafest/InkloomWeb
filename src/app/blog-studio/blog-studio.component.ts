import { Component, QueryList, ViewChildren, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAlignLeft,
  faCheck,
  faCheckCircle,
  faCircle,
  faClipboard,
  faCloudUpload,
  faCode,
  faEllipsisH,
  faGlobeAsia,
  faHeading,
  faImage,
  faLock,
  faPencilAlt,
  faPlus,
  faQuoteLeftAlt,
  faSave,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as randomUUID } from 'uuid';
import { ImageInputComponent } from '../../ui/image-input/image-input.component';
import { UserService } from '../services/user.service';
import { BlockType, Blog } from '../models/blog';
import {
  SelectInputComponent,
  TSelectOption,
} from '../../ui/select-input/select-input.component';
import { isPlatformBrowser } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { map, Observable } from 'rxjs';
import { RichTextInputComponent } from '../../ui/rich-text-input/rich-text-input.component';
import LanguageOptions from '../../assets/languages.json';

import { ActivatedRoute } from '@angular/router';
import { BlogContentBlockComponent } from '../../ui/blog-content-block/blog-content-block.component';
import { HljsComponent } from '../../ui/hljs-component';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [
    FormsModule,
    InputGroupComponent,
    ButtonComponent,
    FontAwesomeModule,
    ImageInputComponent,
    SelectInputComponent,
    RichTextInputComponent,
    BlogContentBlockComponent,
  ],
  templateUrl: './blog-studio.component.html',
  styleUrl: './blog-studio.component.css',
})
export class BlogStudioComponent extends HljsComponent {
  blog: Blog = {
    id: 0,
    title: '',
    subtitle: '',
    tags: [],
    content: [],
    headerImage: '',
    public: true,
    status: 'DRAFT',
    author: {
      username: '',
      displayName: '',
    },
    publishedDate: '',
    readingTime: 1,
  };

  get blogContent() {
    return this.blog.content.filter(
      (block) => block.content.length > 0 || block.type === 'separator'
    );
  }

  tags: TSelectOption[] = [];
  headerImageFile: File | null = null;
  showToolbar = true;

  faHeading = faHeading;
  faSubheading = faHeading;
  faRichText = faAlignLeft;
  faBlockQuote = faQuoteLeftAlt;
  faCode = faCode;
  faImage = faImage;
  faSeparator = faEllipsisH;

  faDisc = faCircle;

  faOk = faCheck;
  faTrash = faTrashAlt;

  faSave = faSave;
  faPublish = faCloudUpload;

  faPrivate = faLock;
  faPublic = faGlobeAsia;

  faAdd = faPlus;
  faCopy = faClipboard;

  statusIcons = {
    DRAFT: faPencilAlt,
    ARCHIVED: faTrashAlt,
    PUBLISHED: faCheckCircle,
  };

  titleId = randomUUID();
  subtitleId = randomUUID();
  headerImageId = randomUUID();
  tagsId = randomUUID();

  currentEditing: string = '';

  savingOrLoadingBlog = false;

  @ViewChildren(RichTextInputComponent)
  richTextInputs!: QueryList<RichTextInputComponent>;

  dragBlockId: string | null = null;
  copyBlockId: string | null = null;

  languages = LanguageOptions;
  getLanguageName(value: string) {
    return (
      this.languages.find((option) => option.value === value)?.label ??
      'Plain Text'
    );
  }

  constructor(
    protected userService: UserService,
    protected blogService: BlogService,
    private route: ActivatedRoute
  ) {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.route.queryParams.subscribe(async (params) => {
        const blogId = parseInt(params['id'] ?? '0');

        if (!blogId) {
          this.setEditing(this.titleId);
          this.blog.publishedDate = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });

          const user = this.userService.user();
          this.blog.author = {
            displayName: user?.displayName ?? '',
            username: user?.username ?? '',
            about: user?.about ?? '',
            avatar: user?.avatar ?? '',
          };
          return;
        }

        this.savingOrLoadingBlog = true;
        const blogResponse = await this.blogService.getBlog(blogId);

        blogResponse.subscribe({
          next: ({ data: blog }) => {
            this.blog = blog;

            this.blog.publishedDate = new Date(
              new Date(this.blog.publishedDate || 0).valueOf() >
              new Date(0).valueOf()
                ? this.blog.publishedDate
                : new Date().toISOString()
            ).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            this.blog.content = this.blog.content.map((block) => ({
              ...block,
              id: (block.metadata ?? {})['uuid'] ?? randomUUID(),
            }));

            this.tags = this.blog.tags.map((t) => ({
              id: t,
              label: t,
              value: t,
            }));
          },
          complete: () => {
            this.savingOrLoadingBlog = false;
            this.setEditing(this.titleId);
          },
          error: () => {
            this.savingOrLoadingBlog = false;
            this.setEditing(this.titleId);
          },
        });
      });
    });
    super();
  }

  setEditing(id: string) {
    this.currentEditing = id;
    setTimeout(() => {
      // Focus the correct rich text input if present
      const richText = this.richTextInputs?.find((cmp) => cmp.id === id);
      if (richText?.quillEditor) {
        richText.focus();
        return;
      }
      // fallback: focus input/textarea for other block types
      const parentElement = document.getElementById(id);
      if (!parentElement) return;
      parentElement.focus();
      parentElement.getElementsByTagName('input')[0]?.focus();
      parentElement.getElementsByTagName('textarea')[0]?.focus();
    });
  }

  addBlock(type: BlockType) {
    const id = randomUUID();
    this.blog.content.push({
      id,
      type,
      content: '',
      metadata:
        type === 'image'
          ? { file: null }
          : type === 'code'
          ? {
              language: LanguageOptions[0].value,
            }
          : {},
    });
    this.setEditing(id);
  }

  removeBlock(id: string) {
    this.blog.content = this.blog.content.filter((block) => block.id !== id);
  }

  handleHeaderImageChange = (url: string, file: File | null) => {
    this.headerImageFile = file;
    this.blog.headerImage = url;
  };

  handleImageChange = (id: string) => (url: string, file: File | null) => {
    this.blog.content = this.blog.content.map((block) => {
      if (block.id !== id) {
        return block;
      }

      return {
        ...block,
        content: url,
        metadata: { ...block.metadata, file },
      };
    });
  };

  handleCaptionChange = (id: string) => (caption: string) => {
    this.blog.content = this.blog.content.map((block) => {
      if (block.id !== id) {
        return block;
      }

      return { ...block, metadata: { ...block.metadata, caption } };
    });
  };

  handleBlurOnElements: EventListener = (event) => {
    const target = event.target as HTMLElement;
    const blurred = [
      'editor-ui-container',
      'blog-editor',
      'editor-meta-block',
      'editor-blocks',
    ].some((token) => target.classList.contains(token));
    if (blurred) {
      this.setEditing('');
    }
  };

  handleBlockClick = (event: Event, blockId: string) => {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    if (
      !blockId ||
      ['button', 'path'].includes(target.tagName.toLowerCase()) ||
      target.getAttribute('ignore-click')
    ) {
      return;
    }
    this.setEditing(blockId);
  };

  async loadTagOptions(search: string): Promise<Observable<TSelectOption[]>> {
    const searchTrimmed =
      search?.trim()?.toLowerCase()?.split(' ')?.at(-1) || '';

    const tagsResponse = (await this.blogService.getTags(searchTrimmed)).pipe(
      map(({ data }) =>
        data.map((tag) => ({ id: tag, value: tag, label: tag }))
      )
    );
    return tagsResponse;
  }

  private addPrefixToFileName(file: File, prefix: string) {
    return new File([file], `${prefix}_${file.name}`, { type: file.type });
  }

  async saveBlog(isDraft: boolean) {
    this.blog.tags = this.tags.map((t) => t.value);
    this.blog.status = isDraft ? 'DRAFT' : 'PUBLISHED';
    this.blog.content = this.blogContent.map((block) => ({
      ...block,
      metadata: {
        uuid: block.id,
        ...block.metadata,
      },
    }));

    if (this.headerImageFile) {
      this.headerImageFile = this.addPrefixToFileName(
        this.headerImageFile,
        'headerImage'
      );
    }

    const images = [
      ...(this.headerImageFile ? [this.headerImageFile] : []),
      ...this.blog.content
        .filter((block) => block.type === 'image' && block.metadata['file'])
        .map((block) => {
          const file = this.addPrefixToFileName(
            block.metadata['file'],
            block.id
          );
          delete block.metadata['file'];
          return file;
        }),
    ];

    this.savingOrLoadingBlog = true;
    const blogResponse = await this.blogService.saveBlog(this.blog, images);
    blogResponse.subscribe({
      error: () => {
        this.savingOrLoadingBlog = false;
      },
      complete: () => {
        this.savingOrLoadingBlog = false;
      },
    });
  }

  onDragStart(event: DragEvent, blockId: string) {
    this.dragBlockId = blockId;
    event.dataTransfer?.setData('text/plain', blockId);
    event.dataTransfer!.effectAllowed = 'move';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent, targetBlockId: string) {
    event.preventDefault();
    const draggedId =
      this.dragBlockId || event.dataTransfer?.getData('text/plain');
    if (!draggedId || draggedId === targetBlockId) return;
    const fromIndex = this.blog.content.findIndex((b) => b.id === draggedId);
    const toIndex = this.blog.content.findIndex((b) => b.id === targetBlockId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = this.blog.content.splice(fromIndex, 1);
    this.blog.content.splice(toIndex, 0, moved);
    this.dragBlockId = null;
  }

  onDragEnd() {
    this.dragBlockId = null;
  }
}
