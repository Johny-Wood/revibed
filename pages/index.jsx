import { UserAuthorized, UserNotAuthorized } from '@/components/layouts/AuthLayouts';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import MainPageNotAuthorizedWrapper from '@/pages/main-projects/MainPageNotAuthorizedWrapper';
import MainProjectsPageWrapper from '@/pages/main-projects/MainProjectsPageWrapper';
import { SSRFundingNow } from '@/SSR/requests/common/SSREventsRequests';
import { SSRGetMarketplaceWithCookieAndWithoutSort } from '@/SSR/requests/marketplace/SSRMarketplaceRequests';
import { SSRTrendingRequests } from '@/SSR/requests/trending/SSRTrendingRequests';

function IndexPage() {
  return (
    <>
      <UserAuthorized>
        <MainProjectsPageWrapper />
      </UserAuthorized>
      <UserNotAuthorized>
        <MainPageNotAuthorizedWrapper />
      </UserNotAuthorized>
    </>
  );
}

IndexPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(SSRFundingNow(ctx));

  awaitPromises.push(
    SSRGetMarketplaceWithCookieAndWithoutSort({
      ctx,
      location: MarketplaceLocationsConstants.COMING_SOON,
      externalQuery: { inSale: 'false' },
    })
  );

  awaitPromises.push(
    SSRGetMarketplaceWithCookieAndWithoutSort({
      ctx,
      location: MarketplaceLocationsConstants.NEW_RELEASES,
      externalQuery: { inSale: 'true' },
    })
  );

  awaitPromises.push(SSRTrendingRequests(ctx));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default IndexPage;
