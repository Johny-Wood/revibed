import ReleasePageWrapper from '@/pages/release/ReleasePageWrapper';
import { SSRGetWantListInfoWithCookie, SSRLoadReleaseItem } from '@/SSR/requests/wantList/SSRWantListRequests';

function ReleaseItemPage({ query: { releaseItemId } = {} }) {
  return <ReleasePageWrapper id={releaseItemId} />;
}

ReleaseItemPage.getInitialProps = async (ctx) => {
  const { query } = ctx;

  const awaitPromises = [];

  awaitPromises.push(SSRGetWantListInfoWithCookie({ ctx }));
  awaitPromises.push(SSRLoadReleaseItem({ ctx }));

  await Promise.all(awaitPromises);

  return {
    query,
  };
};

export default ReleaseItemPage;
