export type SsoAuthType = 'GOOGLE' | 'FACEBOOK';
export type AuthType = SsoAuthType | 'MAGICLINK' | 'PASSWORD';

export type User = {
  email: string;
  username: string;
  emailVerified: boolean;
  profileComplete: boolean;
  authTypes: AuthType[];
  avatar?: string;
  about?: string;
};
