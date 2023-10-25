import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import PageLayout from '@/components/layouts/PageLayout';
import Marketplace from '@/components/marketplace/Marketplace';
import MarketplaceAndPreOrdersPageWrapper from '@/components/MarketplaceAndPreOrdersPageWrapper';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import TitlesConstants from '@/constants/titles/titlesConstants';
import { getMarketplaceListRequestAction } from '@/redux-actions/marketplace/marketplaceActions';

const metaTitle = TitlesConstants.MARKETPLACE;
const metaDescription = 'Buy rare records in audiophile digital quality';

function MarketplaceWrapper({
  variablesList: { DIGITAL_MARKETPLACE_ENABLED } = {},

  search,

  getMarketplaceListInProcess,
  getMarketplaceListFromApi,
  marketplaceList,
  pageSettings,

  filtersSelected,
  filtersApplied,
  filterApplied,

  sortSelected,

  getMarketplaceListRequest,
}) {
  return (
    <PageDisabledLayout disabled={!DIGITAL_MARKETPLACE_ENABLED}>
      <BaseWebsiteLayout
        headSettings={{
          title: metaTitle,
          description: `${metaDescription}.`,
        }}
        shownBanners
      >
        <PageLayout pageTitle={metaTitle} pageDescription={metaDescription}>
          <MarketplaceAndPreOrdersPageWrapper
            location={MarketplaceLocationsConstants.MARKETPLACE}
            onGetProjects={getMarketplaceListRequest}
          >
            <Marketplace
              items={marketplaceList}
              pageSettings={pageSettings}
              inProcess={getMarketplaceListInProcess}
              loadedFromApi={getMarketplaceListFromApi}
              filtersSelected={filtersSelected}
              filtersApplied={filtersApplied}
              filterApplied={filterApplied}
              sortSelected={sortSelected}
              listWithPadding={false}
              querySearch={search}
            />
          </MarketplaceAndPreOrdersPageWrapper>
        </PageLayout>
      </BaseWebsiteLayout>
    </PageDisabledLayout>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,

    search: state.MarketplaceAndPreOrdersFiltersReducer.search,

    getMarketplaceListInProcess: state.MarketplaceListReducer.getMarketplaceListInProcess,
    getMarketplaceListFromApi: state.MarketplaceListReducer.getMarketplaceListFromApi,
    marketplaceList: state.MarketplaceListReducer.list,
    pageSettings: state.MarketplaceListReducer.pageSettings,

    filtersSelected: state.MarketplaceListReducer.filtersSelected,
    filtersApplied: state.MarketplaceListReducer.filtersApplied,
    filterApplied: state.MarketplaceListReducer.filterApplied,

    sortSelected: state.MarketplaceListReducer.sortSelected,
  }),
  (dispatch) => ({
    getMarketplaceListRequest: (params) => getMarketplaceListRequestAction({ ...params, dispatch }),
  })
)(MarketplaceWrapper);
