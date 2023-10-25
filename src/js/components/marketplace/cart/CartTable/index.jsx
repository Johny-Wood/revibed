import classNames from 'classnames';
import { connect } from 'react-redux';

import MarketplaceRemoveButton from '@/components/marketplace/MarketplaceRemoveButton';
import GoodsTable from '@/components/tables/GoodsTable';
import Coin from '@/components/ui/currency/Coin';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { getCartRequestAction } from '@/redux-actions/marketplace/marketplaceCartActions';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function CartTable({ cart, inProcess, pageSettings, cartInfo: { allItemsAvailable } = {}, getCartRequest }) {
  return (
    <>
      {!allItemsAvailable && (
        <div className={classNames(styles.cartWrapperUnavailable, 'c-last-call')}>{MessagesErrorConstants.CART_UNAVAILABLE}</div>
      )}
      <GoodsTable
        items={cart}
        inProcess={inProcess}
        location="CART"
        pageSettings={pageSettings}
        request={getCartRequest}
        scrollId={ScrollBlockIdConstants.CART_ID}
        route={RoutePathsConstants.CART}
        withHeader
        withHeaderOnly
        withPaginationControl
        restColumns={({ id, rootGoodsId, targetType, purchaseAvailable, price }) => [
          {
            key: `${id}-3`,
            component: <MarketplaceRemoveButton goodsId={id} marketplaceCardId={rootGoodsId || id} targetType={targetType} />,
          },
          {
            key: `${id}-4`,
            component: !purchaseAvailable ? (
              <span className="c-last-call text_size_12">Unavailable</span>
            ) : (
              <b>
                <Coin afterText={floatWithCommaFixedUtil(price)} />
              </b>
            ),
          },
        ]}
      />
    </>
  );
}

export default connect(
  (state) => ({
    cart: state.MarketplaceCartReducer.cart,
    cartInfo: state.MarketplaceCartReducer.cartInfo,
    pageSettings: state.MarketplaceCartReducer.pageSettings,
  }),
  (dispatch) => ({
    getCartRequest: (params = {}) => getCartRequestAction({ ...params, dispatch }),
  })
)(CartTable);
