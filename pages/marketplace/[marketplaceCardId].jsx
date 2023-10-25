import { CommonRegExpConstants } from '@/constants/common/regExp';
import { RoutePathsConstants } from '@/constants/routes/routes';
import MarketplaceItemWrapper from '@/pages/marketplace/MarketplaceItemWrapper';
import { SSRGetMarketplaceCardWithCookie } from '@/SSR/requests/marketplace/SSRMarketplaceRequests';

function MarketplaceCardPage({ marketplaceCardId }) {
  return <MarketplaceItemWrapper marketplaceCardId={marketplaceCardId} />;
}

MarketplaceCardPage.getInitialProps = async (ctx) => {
  const { res, req, store, query: { marketplaceCardId } = {} } = ctx;
  const { VariablesReducer: { variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {} } = {} } = store.getState();

  if (!DIGITAL_MARKETPLACE_ENABLED) {
    return { props: {} };
  }

  if (!marketplaceCardId || !CommonRegExpConstants.INT.test(marketplaceCardId)) {
    if (req && res) {
      res.statusCode = 302;
      res.setHeader('Location', RoutePathsConstants.MARKETPLACE);
      res.end();
    }
  } else {
    await SSRGetMarketplaceCardWithCookie({ ctx });
  }

  return {
    marketplaceCardId,
  };
};

export default MarketplaceCardPage;
