import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import MarketplaceWrapper from '@/pages/marketplace/MarketplaceWrapper';
import { SSRGetMarketplaceWithCookie } from '@/SSR/requests/marketplace/SSRMarketplaceRequests';

function MarketplacePage() {
  return <MarketplaceWrapper />;
}

MarketplacePage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const { VariablesReducer: { variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} } = {} } = store.getState();

  if (!DIGITAL_MARKETPLACE_ENABLED) {
    return { props: {} };
  }

  const awaitPromises = [];

  awaitPromises.push(SSRGetMarketplaceWithCookie({ ctx, location: MarketplaceLocationsConstants.MARKETPLACE }));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default MarketplacePage;
