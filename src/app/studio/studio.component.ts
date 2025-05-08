import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAdd,
  faAlignLeft,
  faCheck,
  faClock,
  faClose,
  faCloudUpload,
  faCode,
  faGlobeAsia,
  faHeading,
  faImage,
  faLock,
  faPlus,
  faSave,
  faTrashAlt,
  faUser,
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

export type TBlockType =
  | 'heading'
  | 'subheading'
  | 'rich-text'
  | 'code'
  | 'image';

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
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css',
})
export class StudioComponent {
  title = '';
  description = '';
  tags: TSelectOption[] = [].map((tag) => ({
    id: tag,
    label: tag,
    value: tag,
  }));
  tagOptions: TSelectOption[] = [
    'technology',
    'programming',
    'design',
    'productivity',
    'business',
    'health',
    'science',
    'education',
    'travel',
    'food',
    'lifestyle',
    'photography',
    'gaming',
    'AI',
    'cybersecurity',
    'web-development',
    'data-science',
    'marketing',
    'career',
    'sustainability',
  ].map((tag) => ({
    id: tag,
    label: tag,
    value: tag,
  }));
  blocks: IBlock[] = [
    {
      id: randomUUID(),
      type: 'rich-text',
      content: '',
      mode: 'view',
    },
  ];
  headerImage: File | null = null;
  headerImageUrl: string = '';

  public: boolean = false;
  status: BlogStatus = 'DRAFT';
  author = '';
  publishedDate = '';

  showToolbar = true;

  faHeading = faHeading;
  faSubheading = faHeading;
  faRichText = faAlignLeft;
  faCode = faCode;
  faImage = faImage;
  faHide = faClose;
  faShow = faAdd;
  faOk = faCheck;
  faTrash = faTrashAlt;
  faUser = faUser;
  faClock = faClock;

  faSave = faSave;
  faPublish = faCloudUpload;

  faPrivate = faLock;
  faPublic = faGlobeAsia;

  faAdd = faPlus;

  titleId = randomUUID();
  descriptionId = randomUUID();
  headerImageId = randomUUID();
  tagsId = randomUUID();

  currentEditing: string = '';

  private readonly platformId = inject(PLATFORM_ID);
  constructor(protected userService: UserService) {
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
    // focus the input element inside the group
    setTimeout(() => {
      const parentElement = document.getElementById(id);
      if (!parentElement) {
        return;
      }
      parentElement.focus();
      // also focus the first input element
      parentElement.getElementsByTagName('input')[0]?.focus();
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

  async loadTagOptions(search: string): Promise<TSelectOption[]> {
    const searchTrimmed = search.trim().toLowerCase().split(' ').at(-1) || '';
    // Simulate async search (replace with API call if needed)
    const filtered = this.tagOptions.filter((tag) =>
      tag.value.toLowerCase().includes(searchTrimmed)
    );
    // If not found, allow creating a new tag
    if (
      search &&
      !filtered.some((tag) => tag.value.toLowerCase() === searchTrimmed)
    ) {
      return [
        ...filtered,
        { id: searchTrimmed, value: searchTrimmed, label: searchTrimmed },
      ];
    }
    return filtered;
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
