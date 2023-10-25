export const youTubeEnableJsapiLinkUtil = (link = '') => `${link}${link.indexOf('?') >= 0 ? '&' : '?'}enablejsapi=1`;

export const getYouTubeLinkIdUtil = (youtubeLink = '') => {
  let str = (youtubeLink.replace('embed/', 'v=').split('v=').pop() ?? '').trim();

  const index = str.indexOf('?');

  if (index !== -1) {
    str = str.slice(0, index);
  }

  return str;
};
