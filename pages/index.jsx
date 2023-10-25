import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import MainProjectsPageWrapper from '@/pages/main-projects/MainProjectsPageWrapper';
import { SSRFundingNow } from '@/SSR/requests/common/SSREventsRequests';
import { SSRRating } from '@/SSR/requests/common/SSRRatingRequests';
import { SSRGetMarketplaceWithCookie } from '@/SSR/requests/marketplace/SSRMarketplaceRequests';
import { SSRGetProjectsWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';
import { SSRTrendingRequests } from '@/SSR/requests/trending/SSRTrendingRequests';

function IndexPage() {
  return <MainProjectsPageWrapper />;
}

IndexPage.getInitialProps = async (ctx) => {
  const { query: { tab } = {} } = ctx;

  const awaitPromises = [];

  awaitPromises.push(SSRFundingNow(ctx));
  awaitPromises.push(SSRRating(ctx));

  if (tab === 'coming-soon') {
    awaitPromises.push(
      SSRGetMarketplaceWithCookie({
        ctx,
        location: MarketplaceLocationsConstants.COMING_SOON,
        externalQuery: { inSale: 'false' },
      })
    );
  } else {
    awaitPromises.push(
      SSRGetMarketplaceWithCookie({
        ctx,
        location: MarketplaceLocationsConstants.NEW_RELEASES,
        externalQuery: { inSale: 'true' },
      })
    );
  }

  if (tab === 'new-arrivals') {
    awaitPromises.push(
      SSRGetProjectsWithCookie({
        ctx,
        location: ProjectsLocationsConstants.NEW_ARRIVALS,
        reducerName: ProjectsReducersConstants.NewArrivalsProjectsReducer,
        withoutLoadedFromApi: false,
      })
    );
  } else {
    awaitPromises.push(SSRTrendingRequests(ctx));
  }

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default IndexPage;
