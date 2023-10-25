export const setCookieUtil = (name, value, params = {}) => {
  const options = {
    path: '/',
    ...params,
  };

  if (options.expires && options.expires.toUTCString) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const optionKey in options) {
    updatedCookie += `; ${optionKey}`;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += `=${optionValue}`;
    }
  }

  document.cookie = updatedCookie;
};

export const getCookieUtil = (name) => {
  if (typeof document !== 'undefined') {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));

    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  return undefined;
};

export const removeCookieUtil = (name) => {
  setCookieUtil(name, '', { expires: 0 });
};
