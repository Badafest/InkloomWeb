export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type Author = {
  username: string;
  avatar?: string;
  about?: string;
};

export type Blog = {
  id?: number;
  title: string;
  description?: string;
  headerImage?: string;
  tags?: string[];
  content?: string;
  public?: boolean;
  status?: BlogStatus;
  author?: Author;
  publishedDate?: string;
};
