import { connect } from 'react-redux';

import ListPageWrapper from '@/components/common/list/ListPageWrapper';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageLayout from '@/components/layouts/PageLayout';
import ReleaseItem from '@/components/release/ReleaseWrapper/_components/ReleasesItems/_components/ReleaseItem';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import { applyWantedFilterAction, loadWantedRequestAction, selectWantedFilterAction } from '@/redux-actions/wanted/wantedActions';

import styles from './styles.module.scss';

const TITLE = 'Wanted';

function WantedWrapper({
  loadWantedFromApi,
  loadWantedInProcess,
  wantedList,
  pageSettings: { page } = {},
  loadWantedRequest,
  variablesList: { PARSED_ITEMS_LIFE_TIME } = {},
  ...restProps
}) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      pageName="wanted-page"
      shownBanners
    >
      <PageLayout
        pageTitle={TITLE}
        pageDescription={`Records that received support and popped up&nbsp;in&nbsp;the last ${PARSED_ITEMS_LIFE_TIME}&nbsp;hours`}
      >
        <ListPageWrapper
          {...restProps}
          inProcess={loadWantedInProcess}
          loadedFromApi={loadWantedFromApi}
          items={wantedList}
          name={styles.wanted}
          request={loadWantedRequest}
          location={SortAndFiltersLocationsConstants.SYSTEM_WANT_LIST_ITEMS}
          path={RoutePathsConstants.WANTED}
          scrollId={ScrollBlockIdConstants.WANTED}
          itemComponent={ReleaseItem}
          pageSettings={page}
          blockClassName={styles.itemsList__block}
          itemInnerProps={{
            innerClassName: styles.wantListReleasesItem,
          }}
        />
      </PageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    wantedList: state.WantedReducer.wantedList,
    loadWantedInProcess: state.WantedReducer.loadWantedInProcess,
    loadWantedFromApi: state.WantedReducer.loadWantedFromApi,
    filtersSelected: state.WantedReducer.filtersSelected,
    pageSettings: state.WantedReducer.pageSettings,
    filtersApplied: state.WantedReducer.filtersApplied,
    filterApplied: state.WantedReducer.filterApplied,
    sortAndFilters: state.WantedSortAndFiltersReducer.sortAndFilters,
  }),
  (dispatch) => ({
    filterSelectAction: (params) => {
      dispatch(selectWantedFilterAction(params));
    },
    filterApplyAction: () => {
      dispatch(applyWantedFilterAction());
    },
    loadWantedRequest: (params) => loadWantedRequestAction({ ...params, dispatch }),
  })
)(WantedWrapper);
