import PurchasesWrapper from '@/pages/personal/purchases/PurchasesWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetPurchasesWithCookie } from '@/SSR/requests/purchases/SSRPurchasesRequests';

function PurchasesPage() {
  return <PurchasesWrapper />;
}

PurchasesPage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const { VariablesReducer: { variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} } = {} } = store.getState();

  if (!DIGITAL_MARKETPLACE_ENABLED) {
    return { props: {} };
  }

  const awaitPromises = [];

  awaitPromises.push(SSRGetPurchasesWithCookie({ ctx }));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(PurchasesPage);
