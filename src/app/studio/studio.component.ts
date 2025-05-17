import {
  Component,
  inject,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAdd,
  faAlignLeft,
  faCheck,
  faCheckCircle,
  faCircle,
  faClose,
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
import { Blog, BlogStatus } from '../models/blog';
import {
  SelectInputComponent,
  TSelectOption,
} from '../../ui/select-input/select-input.component';
import { isPlatformBrowser } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { map, Observable } from 'rxjs';
import { RichTextInputComponent } from '../../ui/rich-text-input/rich-text-input.component';

export type TBlockType =
  | 'heading'
  | 'subheading'
  | 'rich-text'
  | 'blockquote'
  | 'code'
  | 'image'
  | 'separator';

export interface IBlock {
  id: string;
  type: TBlockType;
  content: any;
  mode: 'edit' | 'view';
}
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
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css',
})
export class StudioComponent {
  title = '';

  description = '';

  tags: TSelectOption[] = [];

  blocks: IBlock[] = [];

  headerImage: File | null = null;
  headerImageUrl: string = '';

  public: boolean = true;
  status: BlogStatus = 'DRAFT';
  author = '';
  publishedDate = '';

  showToolbar = true;

  faHeading = faHeading;
  faSubheading = faHeading;
  faRichText = faAlignLeft;
  faBlockQuote = faQuoteLeftAlt;
  faCode = faCode;
  faImage = faImage;
  faSeparator = faEllipsisH;

  faDisc = faCircle;

  faHide = faClose;
  faShow = faAdd;

  faOk = faCheck;
  faTrash = faTrashAlt;

  faSave = faSave;
  faPublish = faCloudUpload;

  faPrivate = faLock;
  faPublic = faGlobeAsia;

  faAdd = faPlus;

  statusIcon = {
    DRAFT: faPencilAlt,
    ARCHIVED: faTrashAlt,
    PUBLISHED: faCheckCircle,
  }[this.status];

  titleId = randomUUID();
  descriptionId = randomUUID();
  headerImageId = randomUUID();
  tagsId = randomUUID();

  currentEditing: string = '';

  private readonly platformId = inject(PLATFORM_ID);

  @ViewChildren(RichTextInputComponent)
  richTextInputs!: QueryList<RichTextInputComponent>;

  constructor(
    protected userService: UserService,
    protected blogService: BlogService
  ) {
    this.publishedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (isPlatformBrowser(this.platformId)) {
      this.setEditing(this.titleId);
    }
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

  addBlock(type: TBlockType) {
    const id = randomUUID();
    this.blocks.push({ id, type, content: '', mode: 'view' });
    this.setEditing(id);
  }

  toggleBlockMode(blockId: string) {
    this.blocks = this.blocks.map((block) =>
      block.id === blockId
        ? { ...block, mode: block.mode === 'edit' ? 'view' : 'edit' }
        : block
    );
  }

  removeBlock(id: string) {
    this.blocks = this.blocks.filter((block) => block.id !== id);
  }

  handleHeaderImageChange = (url: string, file: File | null) => {
    this.headerImage = file;
    this.headerImageUrl = url;
  };

  handleImageChange = (id: string) => (url: string, file: File | null) => {
    this.blocks = this.blocks.map((block) => {
      if (block.id !== id) {
        return block;
      }

      return { ...block, content: { ...block.content, file, url } };
    });
  };

  handleCaptionChange = (id: string) => (caption: string) => {
    this.blocks = this.blocks.map((block) => {
      if (block.id !== id) {
        return block;
      }

      return { ...block, content: { ...block.content, caption } };
    });
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

  async saveBlog(isDraft: boolean) {
    const blog: Blog = {
      public: this.public,
      status: isDraft ? 'DRAFT' : 'PUBLISHED',
      title: this.title,
      description: this.description,
      headerImage: this.headerImageUrl,
      tags: this.tags.map((t) => t.value),

      // TODO: parse blocks to markdown or html
      content: JSON.stringify(this.blocks),
    };

    const images = {
      headerImage: this.headerImage,
      ...this.blocks.reduce(
        (accumulator, current) => ({
          ...accumulator,
          [current.id]: current.content?.file,
        }),
        {}
      ),
    };

    // TODO: Send the data to backend
    console.log('BLOG DATA => ', blog, images);
  }
}
