import pageBackgroundMobile from '@/assets/images/global/bg-mobile.png';
import pageBackgroundTablet from '@/assets/images/global/bg-tablet.png';
import pageBackground from '@/assets/images/global/bg.png';
import PageDecorations from '@/components/common/PageDecorations';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';

import styles from './styles.module.scss';

function AuthPageLayout({ title, children }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title,
      }}
      pageName={styles.pageAuth}
      footerProps={{ withCategoryNavigation: false }}
      withoutFullFooter
    >
      <PageDecorations
        quality={10}
        withRepeatBg
        pageBackgroundDesktop={pageBackground}
        pageBackgroundTablet={pageBackgroundTablet}
        pageBackgroundMobile={pageBackgroundMobile}
      />
      {children}
    </BaseWebsiteLayout>
  );
}

export default AuthPageLayout;
