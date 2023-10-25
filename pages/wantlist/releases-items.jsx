import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import WantListReleasesItemsPageWrapper from '@/pages/want-list/WantListReleasesItemsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetWantListInfoAndListWithCookie } from '@/SSR/requests/wantList/SSRWantListRequests';

function WantListReleasesItemsPage() {
  return <WantListReleasesItemsPageWrapper />;
}

WantListReleasesItemsPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetWantListInfoAndListWithCookie({
      ctx,
      location: SortAndFiltersLocationsConstants.WANT_LIST_ITEMS,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(WantListReleasesItemsPage);
