import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageLayout from '@/components/layouts/PageLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import TitlesConstants from '@/constants/titles/titlesConstants';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import LiveBar from '@/pages/main-projects/LiveBar';
import MyFeed from '@/pages/main-projects/MainProjectsPageWrapper/_components/MyFeed';

const metaTitle = TitlesConstants.FEED;
const metaDescription = 'The latest news from the users and tags you’re following';

function FeedPageWrapper() {
  const { isNotDesktop } = ViewportHook();

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
        description: metaDescription,
      }}
      shownBanners
    >
      <PageLayout pageTitle={metaTitle} pageDescription={metaDescription}>
        <SiteWrapperLayout direction={!isNotDesktop ? 'row' : 'column'}>
          <MyFeed />
          <LiveBar />
        </SiteWrapperLayout>
      </PageLayout>
    </BaseWebsiteLayout>
  );
}

export default FeedPageWrapper;
