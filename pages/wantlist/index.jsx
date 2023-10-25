import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import WantListPageWrapper from '@/pages/want-list/WantListPageWrapper';
import { SSRGetWantListInfoAndListWithCookie } from '@/SSR/requests/wantList/SSRWantListRequests';

function WantListPage() {
  return <WantListPageWrapper />;
}

WantListPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetWantListInfoAndListWithCookie({
      ctx,
      withRedirect: true,
      location: SortAndFiltersLocationsConstants.WANT_LIST_RELEASES,
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default WantListPage;
