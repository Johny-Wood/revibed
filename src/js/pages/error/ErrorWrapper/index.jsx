import styles from '@/components/common/error/Error404PageWrapper/styles.module.scss';
import ErrorPage from '@/components/common/error/ErrorPage';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';

function ErrorWrapper({ statusCode }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Error',
      }}
      pageName={styles.pageError}
      footerProps={{ withCategoryNavigation: false }}
      withoutHeader={!!statusCode}
      withoutFooter={!!statusCode}
    >
      <ErrorPage
        numberError={statusCode}
        textError={statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}
      />
    </BaseWebsiteLayout>
  );
}

export default ErrorWrapper;
