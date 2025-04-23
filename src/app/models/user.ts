export type User = {
  email: string;
  username: string;
  emailVerified: boolean;
  profileComplete: boolean;
  authTypes: ('GOOGLE' | 'FACEBOOK' | 'MAGICLINK' | 'PASSWORD')[];
  avatar?: string;
  about?: string;
};
