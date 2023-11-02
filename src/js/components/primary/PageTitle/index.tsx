import classNames from 'classnames';
import parse from 'html-react-parser';

import styles from './styles.module.scss';

export type PageTitleProps = {
  pageTitle?: string;
  pageDescription?: string;
};

function PageTitle({ pageTitle, pageDescription }: PageTitleProps) {
  return (
    <div className={styles.pageContent__titles}>
      {!!pageTitle && (
        <h1 className={styles.pageContent__title}>
          <b>{pageTitle}</b>
        </h1>
      )}
      {!!pageDescription && <p className={classNames(styles.pageContent__description, 'c-gray-2')}>{parse(pageDescription)}</p>}
    </div>
  );
}

export default PageTitle;
