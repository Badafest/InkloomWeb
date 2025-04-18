type TokenResponse = {
  value: string;
  expiry: string;
};

export type LoginResponse = {
  username: string;
  accessToken: TokenResponse;
  refreshToken: TokenResponse;
};
