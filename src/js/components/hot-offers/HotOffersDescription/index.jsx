import classNames from 'classnames';

import ShowMoreParagraphs from '@/components/common/show-more/ShowMoreParagraphs';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

function HotOffersDescription({ paragraphs, showAll = true, className, titleClassName, previewParagraphCount }) {
  const { isNotDesktop } = ViewportHook();

  return (
    <div className={classNames([styles.hotOffersDescription, className])}>
      <h2 className={classNames([styles.hotOffersDescription__title, titleClassName])}>
        <b>What are Hot offers?</b>
      </h2>
      <div className={styles.hotOffersDescription__content}>
        <ShowMoreParagraphs
          showAll={isNotDesktop ? false : showAll}
          paragraphs={paragraphs}
          previewParagraphCount={previewParagraphCount}
          withButtonArrow={false}
          className={styles.showMore}
          buttonClassName={styles.showMore__button}
        />
      </div>
    </div>
  );
}

export default HotOffersDescription;
