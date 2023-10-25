import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function PageTitle({ pageTitle, pageDescription, pageTitleIcon: PageTitleIcon }) {
  return (
    <div className={styles.pageContent__titles}>
      {!!pageTitle && (
        <h1 className={styles.pageContent__title}>
          {!!PageTitleIcon && <PageTitleIcon />}
          <b>{pageTitle}</b>
        </h1>
      )}
      {!!pageDescription && <p className={classNames([styles.pageContent__description, 'c-gray-2'])}>{parse(pageDescription)}</p>}
    </div>
  );
}

PageTitle.defaultProps = {
  pageTitle: '',
  pageDescription: '',
  pageTitleIcon: undefined,
};

PageTitle.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  pageTitleIcon: PropTypes.any,
};

export default PageTitle;
