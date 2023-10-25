import { useEffect, useRef } from 'react';

import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import BorderTopLayout from '@/components/layouts/BorderTopLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import WantListFilter from '@/components/wantList/list/WantListFilter';
import WantlistNotifications from '@/components/wantList/list/WantlistNotifications';
import WantlistWrapper from '@/components/wantList/list/WantlistWrapper';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import WantListImportStatusConstants from '@/constants/wantList/status';
import {
  applyWantListReleasesItemsFilterAction,
  loadWantListReleasesItemsRequestAction,
  selectWantListReleasesItemsFilterAction,
} from '@/redux-actions/wantList/wantListReleasesItemsActions';
import ScrollService from '@/services/scroll/ScrollService';

const TITLE = 'Wantlist releases items';

function WantListReleasesItemsPageWrapper({
  wantListInfo: { status: wantListStatus } = {},
  wantlistReleasesItems,
  loadWantListReleasesItemsInProcess,
  wantlistReleasesItemsPageSettings,
  filtersSelected,
  filtersApplied,
  filterApplied,
  sortAndFilters,
  filterSelectAction,
  location,
  filterApplyAction,
  loadWantListReleasesItemsRequest,
}) {
  const wantListReleasesItemsRef = useRef(null);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.WANTLIST_RELEASES_ITEMS,
      RoutePathsConstants.WANTLIST,
      wantListReleasesItemsRef
    );
  }, []);

  const scrollTopList = () => {
    setTimeout(() => {
      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTop({
        sectionId: ScrollBlockIdConstants.WANTLIST_RELEASES_ITEMS,
      });
    }, 100);
  };

  const onLoadWantListRequest = ({ init = false, page = 0, size } = {}) => {
    if (loadWantListReleasesItemsInProcess) {
      return;
    }

    loadWantListReleasesItemsRequest({ pageNumber: page, pageSize: size }).then(() => {
      if (!init) {
        scrollTopList();
      }
    });
  };

  const changeFilter = ({
    categoryId,
    items,
    isNowSending = true,
    isApplyFilter = true,
    multi = true,
    beforeResetCategory = false,
  }) => {
    filterSelectAction({
      location,
      categoryId,
      selected: items,
      multi,
      beforeResetCategory,
    });

    if (isNowSending) {
      if (isApplyFilter) {
        filterApplyAction(location);
      }

      onLoadWantListRequest();
    }
  };
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      pageName="wantlist"
      shownBanners
    >
      {wantListStatus === WantListImportStatusConstants.ACTIVE && (
        <PersonalPageLayout withPersonalTabsNavigation={false} withDashboard={false} withProfileBar={false} withSideBar={false}>
          <SiteWrapperLayout withPadding={false}>
            <WrapperContainerLayout>
              <DesktopLayout>
                <WantListFilter
                  location="WANT_LIST_RELEASES_ITEMS"
                  onLoadRequest={onLoadWantListRequest}
                  changeFilter={changeFilter}
                  filtersSelected={filtersSelected}
                  filtersApplied={filtersApplied}
                  filterApplied={filterApplied}
                  sortAndFilters={sortAndFilters}
                />
              </DesktopLayout>
              <BorderTopLayout>
                <WantlistWrapper />
                <WantlistNotifications
                  releaseItems={wantlistReleasesItems}
                  inProcess={loadWantListReleasesItemsInProcess}
                  onLoad={onLoadWantListRequest}
                  pageSettings={wantlistReleasesItemsPageSettings}
                />
              </BorderTopLayout>
            </WrapperContainerLayout>
          </SiteWrapperLayout>
        </PersonalPageLayout>
      )}
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    wantListInfo: state.WantListReducer.wantListInfo,

    wantlistReleasesItems: state.WantListReleasesItemsReducer.wantlistReleasesItems,
    loadWantListReleasesItemsInProcess: state.WantListReleasesItemsReducer.loadWantListReleasesItemsInProcess,
    wantlistReleasesItemsPageSettings: state.WantListReleasesItemsReducer.wantlistReleasesItemsPageSettings,

    filtersSelected: state.WantListReleasesItemsReducer.filtersSelected,
    filtersApplied: state.WantListReleasesItemsReducer.filtersApplied,
    filterApplied: state.WantListReleasesItemsReducer.filterApplied,

    sortAndFilters: state.WantListReleasesItemsSortAndFiltersReducer.sortAndFilters,
  }),
  (dispatch) => ({
    loadWantListReleasesItemsRequest: (params) => loadWantListReleasesItemsRequestAction(params)(dispatch),
    filterSelectAction: (params) => {
      dispatch(selectWantListReleasesItemsFilterAction(params));
    },
    filterApplyAction: (location) => {
      dispatch(applyWantListReleasesItemsFilterAction(location));
    },
  })
)(WantListReleasesItemsPageWrapper);
