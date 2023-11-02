import type { PropsWithChildren } from 'react';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import type { PageTitleProps } from '@/components/primary/PageTitle';
import PageTitle from '@/components/primary/PageTitle';

import styles from './styles.module.scss';

type PageLayoutProps = PageTitleProps & PropsWithChildren;

function PageLayout({
  children,

  ...restProps
}: PageLayoutProps) {
  return (
    <div className={styles.pageContent}>
      <SiteWrapperLayout className={styles.pageContent__wrapper}>
        <PageTitle {...restProps} />
      </SiteWrapperLayout>
      {children}
    </div>
  );
}

export default PageLayout;
