export type SsoAuthType = 'GOOGLE' | 'FACEBOOK';
export type AuthType = SsoAuthType | 'MAGICLINK' | 'PASSWORD';

export type User = {
  email: string;
  username: string;
  emailVerified: boolean;
  profileComplete: boolean;
  authTypes: AuthType[];
  following: number;
  followers: number;
  blogs: number;
  displayName?: string;
  avatar?: string;
  avatarImage?: File;
  about?: string;
};
