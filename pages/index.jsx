import { UserAuthorized, UserNotAuthorized } from '@/components/layouts/AuthLayouts';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import MainPageNotAuthorizedWrapper from '@/pages/main-projects/MainPageNotAuthorizedWrapper';
import MainProjectsPageWrapper from '@/pages/main-projects/MainProjectsPageWrapper';
import { SSRCollectionsRequests } from '@/SSR/requests/collections/SSRCollectionsRequest';
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

  const { store } = ctx;

  const { AuthReducer: { userIsAuthorized } = {} } = store.getState();

  if (userIsAuthorized) {
    awaitPromises.push(SSRFundingNow(ctx));

    awaitPromises.push(
      SSRGetMarketplaceWithCookieAndWithoutSort({
        ctx,
        location: MarketplaceLocationsConstants.COMING_SOON,
        externalQuery: { inSale: 'false' },
      })
    );
  } else {
    awaitPromises.push(SSRCollectionsRequests(ctx));
  }

  awaitPromises.push(SSRTrendingRequests(ctx));

  awaitPromises.push(
    SSRGetMarketplaceWithCookieAndWithoutSort({
      ctx,
      location: MarketplaceLocationsConstants.NEW_RELEASES,
      externalQuery: { inSale: 'true' },
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default IndexPage;
