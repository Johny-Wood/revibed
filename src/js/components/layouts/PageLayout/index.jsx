import PropTypes from 'prop-types';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import PageTitle from '@/components/primary/PageTitle';

import styles from './styles.module.scss';

function PageLayout({
  pageTitle,
  pageDescription,
  pageTitleIcon,

  children,
}) {
  return (
    <div className={styles.pageContent}>
      <SiteWrapperLayout className={styles.pageContent__wrapper}>
        <PageTitle pageTitle={pageTitle} pageDescription={pageDescription} pageTitleIcon={pageTitleIcon} />
      </SiteWrapperLayout>
      {children}
    </div>
  );
}

PageLayout.defaultProps = {
  pageTitle: '',
  pageDescription: '',
  pageTitleIcon: undefined,
};

PageLayout.propTypes = {
  pageTitle: PropTypes.string,
  pageDescription: PropTypes.string,
  pageTitleIcon: PropTypes.any,
};

export default PageLayout;
