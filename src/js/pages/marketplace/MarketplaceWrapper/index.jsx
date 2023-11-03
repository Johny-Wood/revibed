import { connect } from 'react-redux';
import MarketplaceAndPreOrdersSearch from 'src/js/components/MarketplaceAndPreOrdersSearch';

import ToPreOrdersBlackBanner from '@/components/common/banners/ToPreOrdersBlackBanner';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import PageLayout from '@/components/layouts/PageLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import Marketplace from '@/components/marketplace/Marketplace';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import TitlesConstants from '@/constants/titles/titlesConstants';
import { getMarketplaceListRequestAction, setMarketplaceSearchAction } from '@/redux-actions/marketplace/marketplaceActions';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.MARKETPLACE;
const metaDescription = 'Browse the catalogue of rare records digitised in audiophile quality';

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
  setMarketplaceSearch,
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
          <SiteWrapperLayout direction="column" firstInPage>
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
              customListPageBanner={<ToPreOrdersBlackBanner isMobile />}
            >
              <MarketplaceAndPreOrdersSearch
                location={MarketplaceLocationsConstants.MARKETPLACE}
                search={search}
                onGetProjects={getMarketplaceListRequest}
                onChangeSearch={(newSearch) => {
                  setMarketplaceSearch({
                    search: newSearch,
                    location: MarketplaceLocationsConstants.MARKETPLACE,
                  });
                }}
              />
            </Marketplace>
            <ToPreOrdersBlackBanner className={styles.MarketplaceWrapper__fullBanner} />
          </SiteWrapperLayout>
        </PageLayout>
      </BaseWebsiteLayout>
    </PageDisabledLayout>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,

    search: state.MarketplaceListReducer.search,

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
    getMarketplaceListRequest: (params) =>
      getMarketplaceListRequestAction({
        ...params,
        dispatch,
      }),
    setMarketplaceSearch: (params) => {
      dispatch(setMarketplaceSearchAction(params));
    },
  })
)(MarketplaceWrapper);
