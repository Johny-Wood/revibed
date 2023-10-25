import { useState } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import ShowMoreButton from '@/components/common/show-more/ShowMoreButton';

import styles from './styles.module.scss';

const renderParagraphs = ({ paragraphs }) =>
  paragraphs.map(({ id, paragraph: Paragraph }) => {
    if (!Paragraph) {
      return null;
    }

    return <Paragraph key={`paragraph-${id}`} />;
  });

function ShowMoreParagraphs({ paragraphs, previewParagraphCount, showAll, withButtonArrow, className, buttonClassName }) {
  const [showedMore, setShowedMore] = useState(false);

  if (paragraphs.length === 0) {
    return null;
  }

  const paragraphsIntro = paragraphs.slice(0, previewParagraphCount);
  const paragraphsMore = paragraphs.slice(previewParagraphCount, paragraphs.length);

  return (
    <div className={classNames(styles.showMoreParagraphs, className)}>
      <div>
        {showAll && renderParagraphs({ paragraphs })}
        {!showAll && renderParagraphs({ paragraphs: paragraphsIntro })}
        {showedMore && renderParagraphs({ paragraphs: paragraphsMore })}
      </div>
      <ShowMoreButton
        isOpened={showedMore}
        shown={!showAll}
        withButtonArrow={withButtonArrow}
        showedMore={showedMore}
        setShowedMore={setShowedMore}
        className={classNames(buttonClassName)}
      />
    </div>
  );
}

ShowMoreParagraphs.defaultProps = {
  paragraphs: [],
  previewParagraphCount: 1,
  showAll: false,
  withButtonArrow: true,
};

ShowMoreParagraphs.propTypes = {
  paragraphs: PropTypes.array,
  previewParagraphCount: PropTypes.number,
  showAll: PropTypes.bool,
  withButtonArrow: PropTypes.bool,
};

export default ShowMoreParagraphs;
