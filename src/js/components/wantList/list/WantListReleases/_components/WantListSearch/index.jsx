import { useCallback, useState } from 'react';

import { connect } from 'react-redux';

import SearchInput from '@/components/common-ui/inputs/SearchInput';
import { loadWantListRequestAction, searchWantListAction } from '@/redux-actions/wantList/wantListActions';

import styles from './styles.module.scss';

function WantListSearch({
  loadWantListInProcess,
  wantList,
  searchQuery: searchQueryStore,

  loadWantListRequest,
  searchWantList,
}) {
  const [searched, setSearched] = useState(!!searchQueryStore || false);

  const onSearch = useCallback(
    (querySearch = '') =>
      new Promise((resolve, reject) => {
        searchWantList(querySearch);

        loadWantListRequest({
          pageNumber: 0,
          searchQuery: querySearch,
        })
          .then(() => {
            setSearched(!!querySearch);
            resolve();
          })
          .catch(reject);
      }),
    [loadWantListRequest, searchWantList]
  );

  return (
    <div className={styles.wantListSearch}>
      <SearchInput
        id="wantListSearch"
        onSearch={onSearch}
        resetSearch={onSearch}
        inProcess={loadWantListInProcess}
        searched={searched}
        disabled={wantList.length <= 0 && !searched}
        initialValue={searchQueryStore}
      />
    </div>
  );
}

export default connect(
  (state) => ({
    loadWantListInProcess: state.WantListReducer.loadWantListInProcess,
    wantList: state.WantListReducer.wantList,
    searchQuery: state.WantListReducer.searchQuery,
  }),
  (dispatch) => ({
    searchWantList: (searchQuery) => {
      dispatch(searchWantListAction(searchQuery));
    },
    loadWantListRequest: (params = {}) => loadWantListRequestAction(params)(dispatch),
  })
)(WantListSearch);
