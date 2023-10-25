import ErrorPage from '@/components/common/error/ErrorPage';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';

import styles from './styles.module.scss';

function Error404PageWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Page Not Found',
      }}
      pageName={styles.pageError}
      footerProps={{ withCategoryNavigation: false }}
      withoutFullFooter
    >
      <ErrorPage numberError="404" textError="Page Not Found" />
    </BaseWebsiteLayout>
  );
}

export default Error404PageWrapper;
