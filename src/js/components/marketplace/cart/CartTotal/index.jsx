import classNames from 'classnames';
import { connect } from 'react-redux';

import Coin from '@/components/ui/currency/Coin';
import { floatWithCommaFixedUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function CartTotal({ withCount, cartInfo: { totalSum = 0, goodsCount = 0 } = {}, className, descriptionClassName }) {
  return (
    <div className={classNames(styles.cartTotal, 'f-y-center', className)}>
      <span className={classNames(styles.cartTotal__description, descriptionClassName)}>
        Subtotal
        {withCount && ` (${goodsCount} ${textForLotsOfUtil(goodsCount, ['item', 'items'])})`}:
      </span>
      <b>
        <Coin afterText={floatWithCommaFixedUtil(totalSum)} />
      </b>
    </div>
  );
}

export default connect((state) => ({
  cartInfo: state.MarketplaceCartReducer.cartInfo,
}))(CartTotal);
