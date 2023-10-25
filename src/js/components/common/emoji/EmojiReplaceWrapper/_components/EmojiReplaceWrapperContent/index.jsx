import emojiRegexp from 'emoji-regex';

import { parseEmojiToImgUtil } from '@/utils/emojiUtils';

const urlRegexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

function EmojiReplaceWrapperContent({ text }) {
  const textReplaced = text
    .replace(new RegExp(urlRegexp, 'gi'), (match) => `<a href='${match}' target='_blank' class='c-blue link'>${match}</a>`)
    .replace(emojiRegexp(), (emojiMatch) => emojiMatch);

  return <>{parseEmojiToImgUtil({ text: textReplaced })}</>;
}

export default EmojiReplaceWrapperContent;
