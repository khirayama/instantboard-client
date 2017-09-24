import * as Cookie from 'js-cookie';

const tokenManager = {
  key: '__instantboard_token',
  set: (token: string|null) => {
    const now = new Date();
    const expires = new Date(now.setFullYear(now.getFullYear() + 3));

    Cookie.set(tokenManager.key, token, {
      // Cookie spec: http://www.yunabe.jp/docs/cookie_and_security.html
      // No set domain: https://blog.tokumaru.org/2011/10/cookiedomain.html
      // No set secure:
      expires,
    });
  },
  get: () => {
    return Cookie.get(tokenManager.key);
  },
};
export default tokenManager;
