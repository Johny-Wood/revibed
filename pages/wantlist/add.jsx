import AddWantListPageWrapper from '@/pages/want-list/AddWantListPageWrapper';
import { SSRGetWantListInfoWithCookie } from '@/SSR/requests/wantList/SSRWantListRequests';

function AddWantListPage() {
  return <AddWantListPageWrapper />;
}

AddWantListPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(SSRGetWantListInfoWithCookie({ ctx }));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default AddWantListPage;
