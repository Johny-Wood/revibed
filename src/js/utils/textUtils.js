import parse, { attributesToProps, domToReact } from 'html-react-parser';

import { youTubeEnableJsapiLinkUtil } from '@/utils/linkUtils';

export const textForLotsOfUtil = (initNumber = 0, [firstEnding, secondEnding] = []) => {
  if (initNumber === 1) {
    return firstEnding;
  }

  return secondEnding;
};

export const isTextChangedUtil = (oldValue, newValue) => Boolean(oldValue || newValue) && oldValue !== newValue;

export const clearSymbolsUtil = (string) => (string ? string.replace(/[^\d]/g, '') : '');

export const numberWithSpacesUtil = (number, fixedNumber) => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const numberFinish = parts.join(',');

  if (!fixedNumber) {
    return numberFinish;
  }

  const numberSplit = numberFinish.split(',');

  const whole = `${numberSplit[0]}`;
  const remains = `${`${numberSplit[1] ? numberSplit[1] : ''}`.slice(0, fixedNumber)}`;

  const valueLength = `${remains}`.length;
  const replaceValueLength = valueLength > 1 ? valueLength : 2;

  return `${whole},${`${remains}00`.slice(0, replaceValueLength)}`;
};

export const floatWithCommaUtil = (number = 0, fixedNumber) => numberWithSpacesUtil(number, fixedNumber);

export const floatWithCommaFixedUtil = (number = 0, fixedNumber = 2) => floatWithCommaUtil(+number, fixedNumber);

export const splitTextUtil = (text = '', sliceLength = 0, showedMore = false) => {
  const moreText = text.slice(sliceLength, text.length);
  const introText = text.slice(0, Math.max(0, /^[a-zA-Z0-9]+$/.test(text[sliceLength - 1]) ? sliceLength : sliceLength - 1));

  return {
    introText: `${introText}${moreText.length > 0 && !showedMore ? '...' : ''}`,
    moreText,
  };
};

export const parseToPathNameUtil = (text = '') =>
  text
    .toLowerCase()
    .replace(/[\\[\]{}/():;=*+?!.,'~^$|&-]/g, '')
    .replace(/\s/gi, '-')
    .replace(/’/gi, '')
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());

export const parseReplaceTextUtil = (text = '', replaceValue) => text.replace(/%X/gi, `${replaceValue || ''}`);

export const textToCamelCaseUtil = (target = '', separator = '_') =>
  target
    .split(separator)
    .reduce((prev, current, idx) => (idx === 0 ? current : prev + current.charAt(0).toUpperCase() + current.slice(1)), '');

export const cropCounterUtil = ({ counter = 0, limit = 100 } = {}) => (counter >= limit ? `+${limit - 1}` : counter);

export const parseBodyHtmlUtil = ({ body = '' } = {}) =>
  parse(body, {
    // eslint-disable-next-line consistent-return
    replace: (domNode) => {
      const { name, type, attribs: { ...attribs } = {}, children } = domNode;

      if (name === 'a' && type === 'tag') {
        return (
          <a {...attributesToProps(attribs)} target="_blank">
            {domToReact(children)}
          </a>
        );
      }

      if (name === 'iframe' && type === 'tag') {
        const { attribs: { src, title, height = 320, width = 605 } = {} } = domNode;

        return (
          <iframe
            {...attributesToProps(attribs)}
            title={title}
            width={width}
            height={height}
            src={youTubeEnableJsapiLinkUtil(src)}
            style={{
              aspectRatio: width / height,
            }}
          />
        );
      }
    },
  });
