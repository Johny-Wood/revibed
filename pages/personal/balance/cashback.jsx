import CashbackWrapper from '@/pages/personal/balance/CashbackWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRPersonalCashbackRequests } from '@/SSR/requests/personal/balance/SSRPersonalCashbackRequests';

const CashbackPage = () => <CashbackWrapper />;

CashbackPage.getInitialProps = async (ctx) => {
  const { store } = ctx;

  const { VariablesReducer: { variablesList: { ISSUANCE_OF_CASHBACK_ENABLED } } = {} } = store.getState();

  if (!ISSUANCE_OF_CASHBACK_ENABLED) {
    return { props: {} };
  }

  const awaitPromises = [];

  awaitPromises.push(SSRPersonalCashbackRequests(ctx));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(CashbackPage);
