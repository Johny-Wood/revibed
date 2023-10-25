import { useEffect } from 'react';

import classNames from 'classnames';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import NextRouter from '@/services/NextRouter';
import ScrollService from '@/services/scroll/ScrollService';
import { getDateFormatUtil } from '@/utils/dateUtils';
import { parseBodyHtmlUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function FaqActiveContent({ faqListActive: { title, updatedAt, id: categoryId, faqs = [] } = {} }) {
  useEffect(() => {
    const { router: { router: { asPath } = {} } = {} } = NextRouter.getInstance();
    const anchor = asPath.split('#').pop();
    if (!anchor) {
      return;
    }

    const anchorElement = document.getElementById(anchor);
    if (!anchorElement) {
      return;
    }

    const elementTop = anchorElement.getBoundingClientRect().top;
    if (elementTop <= 0) {
      return;
    }

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTo({
      elementTop: elementTop - 70,
    });
  }, []);

  return (
    <div className={styles.faqGroup}>
      {!!title && <h1 className={styles.faqGroup__title}>{title}</h1>}
      {!!updatedAt && (
        <time className={styles.faqGroup__date}>
          Updated:
          {getDateFormatUtil(updatedAt, 'MMM DD, YYYY')}
        </time>
      )}
      <div className={globalStyles.breakWord}>
        {faqs.map(({ id, question, answer }) => (
          <div
            key={`faq-${categoryId}-item-${id}`}
            className={classNames([
              styles.faqGroupCategory__answer__wrapper,
              'p-top-20 p-bottom-20',
              question.length <= 1 && styles.faqGroupCategory__answer__wrapper_without_question,
            ])}
          >
            {question.length > 1 && <h2 className={styles.faqGroupCategory__question}>{question}</h2>}
            <div className={classNames([styles.faqGroupCategory__answer, 'm-top-10'])}>{parseBodyHtmlUtil({ body: answer })}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqActiveContent;
