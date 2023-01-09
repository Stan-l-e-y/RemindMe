import Cookies from 'cookies';

export const accessTokenCookieOptions: Cookies.SetOption = {
  maxAge: 3.154e10, // 1 year
  httpOnly: true,
  domain: 'localhost',
  path: '/',
  sameSite: 'lax',
  secure: false,
};

export const refreshTokenCookieOptions: Cookies.SetOption = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};
