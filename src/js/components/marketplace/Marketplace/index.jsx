import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ListPageWrapper from '@/components/common/list/ListPageWrapper';
import { ListWrapperDefaultProps, ListWrapperPropTypes } from '@/components/common/list/ListWrapper';
import MarketplaceList from '@/components/marketplace/MarketplaceList';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import {
  applyMarketplaceFilterAction,
  getMarketplaceListRequestAction,
  selectMarketplaceFilterAction,
} from '@/redux-actions/marketplace/marketplaceActions';

import styles from './styles.module.scss';

function Marketplace({ getMarketplaceListRequest, ...restProps }) {
  return (
    <ListPageWrapper
      {...restProps}
      request={getMarketplaceListRequest}
      location={SortAndFiltersLocationsConstants.MARKETPLACE}
      path={RoutePathsConstants.MARKETPLACE}
      scrollId={ScrollBlockIdConstants.MARKETPLACE_ID}
      listWrapper={MarketplaceList}
      withMarginBottomMinus
      name={styles.marketplace}
      sideBarLayoutClassName={styles.itemsList__sideBar}
      listClassName={styles.itemsList__list}
      blockClassName={styles.itemsList__block}
    />
  );
}

Marketplace.defaultProps = {
  loadedFromApi: false,
  name: '',
  ...ListWrapperDefaultProps,
};

Marketplace.propTypes = {
  loadedFromApi: PropTypes.bool,
  name: PropTypes.string,
  ...ListWrapperPropTypes,
};

export default connect(
  (state) => ({
    sortAndFilters: state.MarketplaceSortAndFiltersReducer.sortAndFilters,
  }),
  (dispatch) => ({
    filterSelectAction: (params) => {
      dispatch(selectMarketplaceFilterAction(params));
    },
    filterApplyAction: (params) => {
      dispatch(applyMarketplaceFilterAction(params));
    },
    getMarketplaceListRequest: (params) => getMarketplaceListRequestAction({ ...params, dispatch }),
  })
)(Marketplace);
