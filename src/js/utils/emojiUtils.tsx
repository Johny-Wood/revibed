import classNames from 'classnames';
import emojiData from 'emoji-datasource-twitter';
import parse from 'html-react-parser';
import Image from 'next/image';

type GenerateEmojiToImgProps = {
  shortName: string | undefined;
};

export const generateEmojiToImg = ({ shortName = '' }: GenerateEmojiToImgProps) => {
  const { unified, image } = emojiData.find(({ short_names: foundShortNames }) => foundShortNames.includes(shortName)) ?? {};

  return shortName
    ? `<img src='/emoji-datasource-twitter/img/64/${image}' class='emoji' data-codepoints='${unified?.toLowerCase()}'  alt='${unified?.toLowerCase()}'/>`
    : shortName;
};

type ParseEmojiToImgUtilProps = {
  text: string | undefined;
};

export const parseEmojiToImgUtil = ({ text = '' }: ParseEmojiToImgUtilProps) =>
  parse(text, {
    // eslint-disable-next-line consistent-return
    replace: (domNode) => {
      // @ts-ignore
      const { type, name, attribs } = domNode ?? {};

      const { src, class: className, dataCodepoints } = attribs ?? {};

      if (type === 'tag' && name === 'img' && !!src) {
        return <Image src={src} width={17} height={17} alt={dataCodepoints || className} className={classNames(className)} />;
      }
    },
  });
