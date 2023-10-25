import CartWrapper from '@/pages/marketplace/cart/CartWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import {
  SSRGetMarketPlaceCartInfoWithCookie,
  SSRGetMarketPlaceCartWithCookie,
} from '@/SSR/requests/marketplace/SSRMarketplaceRequests';

function CartPage() {
  return <CartWrapper />;
}

CartPage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const { VariablesReducer: { variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} } = {} } = store.getState();

  if (!DIGITAL_MARKETPLACE_ENABLED) {
    return { props: {} };
  }

  const awaitPromises = [];

  awaitPromises.push(SSRGetMarketPlaceCartInfoWithCookie({ ctx }));
  awaitPromises.push(SSRGetMarketPlaceCartWithCookie({ ctx }));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(CartPage);
