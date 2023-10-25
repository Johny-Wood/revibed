import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';

function RulesPageLayout({ title, children }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title,
      }}
    >
      <SiteWrapperLayout>{children}</SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default RulesPageLayout;
