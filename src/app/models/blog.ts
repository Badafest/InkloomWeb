export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type Author = {
  username: string;
  avatar?: string;
  about?: string;
};

export type BlockType =
  | 'richText'
  | 'heading'
  | 'subHeading'
  | 'code'
  | 'blockquote'
  | 'image'
  | 'separator';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata: {
    [k: string]: any;
  };
}

export type BlogPreview = {
  id: number;
  title: string;
  subtitle: string;
  headerImage: string;
  tags: string[];
  publishedDate: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
    about?: string;
  };
};

export type Blog = BlogPreview & {
  public: boolean;
  status: BlogStatus;
  content: Block[];
  readingTime: number;
};
