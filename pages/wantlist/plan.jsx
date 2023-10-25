import WantListPlanPageWrapper from '@/pages/want-list/WantListPlanPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetWantListInfoWithCookie, SSRLoadWantListPlan } from '@/SSR/requests/wantList/SSRWantListRequests';

function WantListPlanPage() {
  return <WantListPlanPageWrapper />;
}

WantListPlanPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(SSRLoadWantListPlan({ ctx }));
  awaitPromises.push(SSRGetWantListInfoWithCookie({ ctx }));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(WantListPlanPage);
