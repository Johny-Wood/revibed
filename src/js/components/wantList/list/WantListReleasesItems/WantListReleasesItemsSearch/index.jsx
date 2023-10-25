import { useCallback, useState } from 'react';

import { connect } from 'react-redux';

import SearchInput from '@/components/common-ui/inputs/SearchInput';
import {
  loadWantListReleasesItemsRequestAction,
  searchWantListReleasesItemsAction,
} from '@/redux-actions/wantList/wantListReleasesItemsActions';

import styles from './styles.module.scss';

function WantListReleasesItemsSearch({
  loadWantListReleasesItemsInProcess,
  wantlistReleasesItems,
  searchQuery: searchQueryStore,

  loadWantListReleasesItemsRequest,
  searchWantListReleasesItems,
}) {
  const [searched, setSearched] = useState(!!searchQueryStore || false);

  const onSearch = useCallback(
    (querySearch = '') =>
      new Promise((resolve, reject) => {
        searchWantListReleasesItems(querySearch);

        loadWantListReleasesItemsRequest({
          pageNumber: 0,
          searchQuery: querySearch,
        })
          .then(() => {
            setSearched(!!querySearch);
            resolve();
          })
          .catch(reject);
      }),
    [loadWantListReleasesItemsRequest, searchWantListReleasesItems]
  );

  return (
    <div className={styles.wantListSearch}>
      <SearchInput
        id="wantListSearch"
        initialValue={searchQueryStore}
        onSearch={onSearch}
        resetSearch={onSearch}
        inProcess={loadWantListReleasesItemsInProcess}
        searched={searched}
        disabled={wantlistReleasesItems.length <= 0 && !searched}
      />
    </div>
  );
}

export default connect(
  (state) => ({
    wantlistReleasesItems: state.WantListReleasesItemsReducer.wantlistReleasesItems,
    loadWantListReleasesItemsInProcess: state.WantListReleasesItemsReducer.loadWantListReleasesItemsInProcess,
    searchQuery: state.WantListReleasesItemsReducer.searchQuery,
  }),
  (dispatch) => ({
    searchWantListReleasesItems: (searchQuery) => {
      dispatch(searchWantListReleasesItemsAction(searchQuery));
    },
    loadWantListReleasesItemsRequest: (params = {}) => loadWantListReleasesItemsRequestAction(params)(dispatch),
  })
)(WantListReleasesItemsSearch);
