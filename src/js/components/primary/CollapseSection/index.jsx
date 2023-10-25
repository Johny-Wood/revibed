import { useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import LinkRoute from '@/components/ui/links/LinkRoute';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

const CollapseSection = ({
  title,
  titleContent,
  titleTag = 'h',
  titleTagNumber,
  href,

  titleClassName,
  initialOpened,

  afterContent: AfterContent = () => null,
  afterContentProps,

  triggerClose,

  children,
  className,
  categoryClassName,
}) => {
  const [showedCategory, setShowedCategory] = useState(initialOpened);

  useEffect(() => {
    if (triggerClose) {
      setShowedCategory(false);
    }
  }, [triggerClose]);

  const titleParams = useMemo(
    () => ({
      className: classNames(styles.category__name, 't-bold', globalStyles.cursorPointer, titleClassName),
      onClick: () => {
        setShowedCategory(!showedCategory);
      },
    }),
    [showedCategory, titleClassName]
  );

  const renderTitleContent = () => (
    <>
      {titleTag === 'a' ? (
        <LinkRoute href={href} className={styles.collapseSection__link}>
          {title}
        </LinkRoute>
      ) : (
        title
      )}
      {titleContent()}
      <div
        className="i-arrow"
        onClick={(e) => {
          if (titleTag === 'a') {
            e.stopPropagation();
          }
        }}
      >
        <ArrowIcon isOpened={showedCategory} />
      </div>
    </>
  );

  return (
    <div className={classNames(styles.collapseSection, className)}>
      <div className={styles.collapseSection__wrapper}>
        <div className={styles.collapseSection__container}>
          <div className={classNames(styles.category, categoryClassName)}>
            <div className={styles.category__shown}>
              {titleTagNumber === 2 ? (
                <h2 {...titleParams}>{renderTitleContent()}</h2>
              ) : titleTagNumber === 3 ? (
                <h3 {...titleParams}>{renderTitleContent()}</h3>
              ) : (
                <div {...titleParams}>{renderTitleContent()}</div>
              )}
              <AfterContent {...afterContentProps} />
            </div>
            <Collapse isOpened={showedCategory}>
              <div>{children}</div>
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

CollapseSection.defaultProps = {
  title: '',
  titleClassName: '',
  initialOpened: false,
  titleContent: () => null,
  afterContent: () => null,
  afterContentProps: {},
  titleTagNumber: 3,
};

CollapseSection.propTypes = {
  title: PropTypes.string,
  titleClassName: PropTypes.string,
  initialOpened: PropTypes.bool,
  titleContent: PropTypes.func,
  afterContent: PropTypes.any,
  afterContentProps: PropTypes.object,
  titleTagNumber: PropTypes.number,
};

export default CollapseSection;
