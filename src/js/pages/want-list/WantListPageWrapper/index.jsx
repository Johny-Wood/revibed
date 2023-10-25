import { useCallback, useEffect, useRef } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import BorderTopLayout from '@/components/layouts/BorderTopLayout';
import PageLayout from '@/components/layouts/PageLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import WantListFilter from '@/components/wantList/list/WantListFilter';
import WantListReleases from '@/components/wantList/list/WantListReleases';
import WantlistWrapper from '@/components/wantList/list/WantlistWrapper';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import WantListImportStatusConstants from '@/constants/wantList/status';
import {
  applyWantListFilterAction,
  loadWantListRequestAction,
  selectWantListFilterAction,
  setWantListSortSelectedAction,
} from '@/redux-actions/wantList/wantListActions';
import ScrollService from '@/services/scroll/ScrollService';

const TITLE = 'Wantlist';

function WantListPageWrapper({
  location,
  filterSelectAction,
  filterApplyAction,
  wantList,
  sortQuery,
  wantListInfo: { status: wantListStatus } = {},
  getWantListInfoInProcess,
  loadWantListInProcess,

  filtersSelected,
  filtersApplied,
  filterApplied,

  sortAndFilters,

  sortSelectedAction,
  loadWantListRequest,
}) {
  const wantListRef = useRef(null);

  const scrollTopTable = useCallback(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTop({
      sectionId: ScrollBlockIdConstants.WANTLIST_RELEASES,
    });
  }, []);

  const onLoadWantListRequest = useCallback(
    ({ init = false, page = 0, size } = {}) => {
      if (loadWantListInProcess) {
        return;
      }

      loadWantListRequest({
        pageNumber: page,
        pageSize: size,
      }).then(() => {
        if (!init) {
          scrollTopTable();
        }
      });
    },
    [loadWantListInProcess, loadWantListRequest, scrollTopTable]
  );

  const changeFilter = useCallback(
    ({ categoryId, items, isNowSending = true, isApplyFilter = true, multi = true, beforeResetCategory = false }) => {
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
    },
    [filterApplyAction, filterSelectAction, location, onLoadWantListRequest]
  );

  const onSortSelectedAction = useCallback(
    (sortQueryNew) => {
      sortSelectedAction(sortQueryNew);

      onLoadWantListRequest({});
    },
    [onLoadWantListRequest, sortSelectedAction]
  );

  const toggleSort = useCallback(
    ({ keyItem, order = {}, items = [], toggle } = {}) => {
      const itemsTmp = cloneDeep(items);
      const findNewSort = itemsTmp.find((item) => item.value !== order.value);

      const sortQueryNew = {
        [keyItem]: toggle ? order : findNewSort,
      };

      onSortSelectedAction(sortQueryNew);
    },
    [onSortSelectedAction]
  );

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.WANTLIST_RELEASES,
      RoutePathsConstants.WANTLIST,
      wantListRef
    );

    return () => {
      if (!filterApplied) {
        changeFilter({ items: [], isNowSending: false });
      }
    };
  }, [changeFilter, filterApplied]);

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      preloadInProcess={getWantListInfoInProcess}
      pageName="wantlist"
      shownBanners
    >
      {wantListStatus === WantListImportStatusConstants.ACTIVE && (
        <PageLayout pageTitle={TITLE} pageDescription="Effective tool to monitor your Discogs wantlist">
          <PersonalPageLayout withPersonalTabsNavigation={false} withDashboard={false} withProfileBar={false} withSideBar={false}>
            <SiteWrapperLayout withPadding={false} preloadInProcess={getWantListInfoInProcess}>
              <WrapperContainerLayout>
                <DesktopLayout>
                  <WantListFilter
                    location="WANT_LIST"
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
                  <WantListReleases
                    sortQuery={sortQuery}
                    wantList={wantList}
                    onLoadWantListRequest={onLoadWantListRequest}
                    toggleSort={toggleSort}
                    loadWantListInProcess={loadWantListInProcess}
                  />
                </BorderTopLayout>
              </WrapperContainerLayout>
            </SiteWrapperLayout>
          </PersonalPageLayout>
        </PageLayout>
      )}
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    wantList: state.WantListReducer.wantList,
    wantListInfo: state.WantListReducer.wantListInfo,
    getWantListInfoFromApi: state.WantListReducer.getWantListInfoFromApi,
    getWantListInfoInProcess: state.WantListReducer.getWantListInfoInProcess,

    loadWantListInProcess: state.WantListReducer.loadWantListInProcess,

    sortQuery: state.WantListReducer.sortQuery,
    filtersSelected: state.WantListReducer.filtersSelected,
    filtersApplied: state.WantListReducer.filtersApplied,
    filterApplied: state.WantListReducer.filterApplied,

    sortAndFilters: state.WantListReleasesSortAndFiltersReducer.sortAndFilters,
  }),
  (dispatch) => ({
    loadWantListRequest: (params) => loadWantListRequestAction(params)(dispatch),
    sortSelectedAction: (sortQuery) => {
      dispatch(setWantListSortSelectedAction(sortQuery));
    },
    filterSelectAction: (params) => {
      dispatch(selectWantListFilterAction(params));
    },
    filterApplyAction: (location) => {
      dispatch(applyWantListFilterAction(location));
    },
  })
)(WantListPageWrapper);
