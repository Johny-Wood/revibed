import { useMemo, useState } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import EmojiReplaceWrapper from '@/components/common/emoji/EmojiReplaceWrapper';
import ShowMoreButton from '@/components/common/show-more/ShowMoreButton';
import { splitTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ShowMore({
  className,
  buttonClassName,
  text,
  previewText,
  sliceLength,
  showAll,
  withEmoji,
  withButtonArrow,
  withShowMore = true,
  children,
}) {
  const [showedMore, setShowedMore] = useState(false);

  const { introText = '', moreText = '' } = useMemo(
    () => (sliceLength > 0 ? splitTextUtil(text, sliceLength, showedMore) : { introText: text }),
    [showedMore, sliceLength, text]
  );

  const hasMoreText = useMemo(() => !!previewText || (!!moreText && sliceLength !== 0), [moreText, previewText, sliceLength]);

  const shownMore = useMemo(() => hasMoreText && showedMore && !showAll, [hasMoreText, showAll, showedMore]);

  if (!text && !previewText) {
    return null;
  }

  return (
    <div className={classNames([styles.showMore, className])}>
      <div>
        {!withEmoji && parse(introText || previewText)}
        {withEmoji && <EmojiReplaceWrapper text={introText || previewText} />}
        {shownMore && !withEmoji && parse(moreText)}
        {shownMore && withEmoji && <EmojiReplaceWrapper text={moreText} />}
        {((hasMoreText && shownMore) || showAll || !hasMoreText) && children}
      </div>
      {withShowMore && (
        <ShowMoreButton
          className={classNames(buttonClassName)}
          isOpened={showedMore || showAll}
          shown={hasMoreText && !showAll}
          withButtonArrow={withButtonArrow}
          showedMore={showedMore}
          setShowedMore={setShowedMore}
        />
      )}
    </div>
  );
}

ShowMore.defaultProps = {
  text: '',
  previewText: '',
  sliceLength: 145,
  showAll: false,
  withEmoji: false,
  withButtonArrow: false,
};

ShowMore.propTypes = {
  text: PropTypes.string,
  previewText: PropTypes.string,
  sliceLength: PropTypes.number,
  showAll: PropTypes.bool,
  withEmoji: PropTypes.bool,
  withButtonArrow: PropTypes.bool,
};

export default ShowMore;
