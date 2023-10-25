import { useState } from 'react';

import classNames from 'classnames';
import { Collapse } from 'react-collapse';

import Button from '@/components/ui/buttons/Button';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

const CollapseSectionLite = ({ children, title = '' }) => {
  const [showedCategory, setShowedCategory] = useState(false);

  return (
    <div className={classNames(styles.collapseSectionLite)}>
      <div className={styles.collapseSectionLite__wrapper}>
        <div className={styles.collapseSectionLite__container}>
          <div className={styles.collapseSectionLite__category}>
            <Button type="button_string" onClick={() => setShowedCategory(!showedCategory)}>
              <span className="title_xs">{showedCategory ? `Hide ${title}` : `Show ${title}`}</span>
              <ArrowIcon size="small" />
            </Button>
            <Collapse isOpened={showedCategory}>
              <div className={styles.collapseSectionLite__content}>{children}</div>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapseSectionLite;
