import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SelectComponent,
  TSelectOption,
} from '../../ui/select/select.component';
import { InputGroupComponent } from '../../ui/input-group/input-group.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faAdd,
  faAlignLeft,
  faCheck,
  faClock,
  faClose,
  faCode,
  faHeading,
  faImage,
  faTrashAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { v4 as randomUUID } from 'uuid';
import { ImageInputComponent } from '../../ui/image-input/image-input.component';
import { UserService } from '../services/user.service';

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
    SelectComponent,
    InputGroupComponent,
    ButtonComponent,
    FontAwesomeModule,
    ImageInputComponent,
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css',
})
export class StudioComponent {
  title = '';
  subtitle = '';
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
  blocks: IBlock[] = [];

  author = '';
  publishedDate = '';
  isDraft = false;

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

  headerImage: File | null = null;
  headerImageUrl: string =
    'https://cdn.pixabay.com/photo/2019/08/06/22/48/artificial-intelligence-4389372_1280.jpg';

  currentEditing: string = '';

  constructor(protected userService: UserService) {
    this.author = userService.user()?.displayName ?? 'Anonymous';
    this.publishedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  setEditing(id: string) {
    this.currentEditing = id;
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
}
