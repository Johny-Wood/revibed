import { CommonRegExpConstants } from '@/constants/common/regExp';
import { RoutePathsConstants } from '@/constants/routes/routes';
import PurchaseWrapper from '@/pages/personal/purchases/PurchaseWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetPurchaseCardWithCookie } from '@/SSR/requests/purchases/SSRPurchasesRequests';

function PurchasePage({ purchaseId }) {
  return <PurchaseWrapper purchaseId={purchaseId} />;
}

PurchasePage.getInitialProps = async (ctx) => {
  const { res, req, query: { purchaseId } = {}, store } = ctx;
  const { VariablesReducer: { variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} } = {} } = store.getState();

  if (!DIGITAL_MARKETPLACE_ENABLED) {
    return { props: {} };
  }

  if (!purchaseId || !CommonRegExpConstants.INT.test(purchaseId)) {
    if (req && res) {
      res.statusCode = 302;
      res.setHeader('Location', RoutePathsConstants.PERSONAL_PURCHASE);
      res.end();
    }
  } else {
    await SSRGetPurchaseCardWithCookie({ ctx });
  }

  return {
    purchaseId,
  };
};

export default withPrivateAuthRoute(PurchasePage);
