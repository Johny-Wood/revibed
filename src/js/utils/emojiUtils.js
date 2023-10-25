import classNames from 'classnames';
import emojiData from 'emoji-datasource-twitter';
import parse from 'html-react-parser';
import Image from 'next/image';

export const generateEmojiToImg = ({ shortName = '' }) => {
  const { unified, image } = emojiData.find(({ short_name: foundShortName }) => shortName === foundShortName) ?? {};

  return shortName
    ? `<img src='/emoji-datasource-twitter/img/64/${image}' class='emoji' data-codepoints='${unified?.toLowerCase()}'  alt='${unified?.toLowerCase()}'/>`
    : shortName;
};

export const parseEmojiToImgUtil = ({ text }) =>
  parse(text, {
    // eslint-disable-next-line consistent-return
    replace: (domNode) => {
      const { type, name, attribs: { src, class: className, dataCodepoints } = {} } = domNode;

      if (type === 'tag' && name === 'img' && !!src) {
        return <Image src={src} width={17} height={17} alt={dataCodepoints || className} className={classNames(className)} />;
      }
    },
  });
