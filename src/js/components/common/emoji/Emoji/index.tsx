import { generateEmojiToImg, parseEmojiToImgUtil } from '@/utils/emojiUtils';

type EmojiProps = {
  shortName: string;
};

function Emoji({ shortName }: EmojiProps) {
  return parseEmojiToImgUtil({ text: generateEmojiToImg({ shortName }) });
}

export default Emoji;
