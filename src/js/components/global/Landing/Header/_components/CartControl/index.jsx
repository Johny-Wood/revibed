import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import CartControlContent from '@/components/global/Header/_components/CartControl/_components/CartControlContent';
import CartControlNewItem from '@/components/global/Header/_components/CartControl/_components/CartControlNewItem';
import MarketplaceBlockDisabledLayout from '@/components/marketplace/MarketplaceBlockDisabledLayout';
import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import CartIcon from '@/icons/marketplace/CartIcon';

import styles from './styles.module.scss';

const NotificationCount = dynamic(() => import('@/components/common/Notification/NotificationCount'), { ssr: false });

function CartControl({ color, cartInfo: { goodsCount = 0, goods = [] } = {}, addToCartLastDate }) {
  const { isDesktop, width } = ViewportHook();

  const newGoodsTimer = useRef(null);
  const addToCartLastDatePrev = useRef(addToCartLastDate);

  const [shownNewGoods, setShownNewGoods] = useState(false);

  const goodsName = useMemo(() => {
    const { name } = goods[0] || {};

    return name;
  }, [goods]);

  const closeNewGoods = useCallback(() => {
    clearTimeout(newGoodsTimer.current);

    setShownNewGoods(false);
  }, []);

  useEffect(
    () => () => {
      closeNewGoods();
    },
    [closeNewGoods]
  );

  useEffect(() => {
    if (addToCartLastDate > 0 && addToCartLastDatePrev.current !== addToCartLastDate) {
      closeNewGoods();

      setShownNewGoods(true);

      addToCartLastDatePrev.current = addToCartLastDate;

      newGoodsTimer.current = setTimeout(() => {
        closeNewGoods();
      }, 5000);
    }
  }, [addToCartLastDate, closeNewGoods]);

  useEffect(() => {
    if (goods.length === 0 && shownNewGoods) {
      closeNewGoods();
    }
  }, [closeNewGoods, goods.length, shownNewGoods]);

  return (
    <MarketplaceBlockDisabledLayout>
      <div className={styles.cartControl}>
        <Button
          type="button_string"
          tooltip={{
            className: classNames([
              styles.cartControl__tooltip,
              !shownNewGoods ? styles.cartControl__tooltip_all : styles.cartControl__tooltip_new,
            ]),
            shown: shownNewGoods,
            canShow: true,
            color: 'white',
            withCloseButton: false,
            size: ComponentsCommonConstants.Size.LARGE,
            width: !shownNewGoods ? 400 : 200,
            position: isDesktop || shownNewGoods ? 'bottom-center' : width > 500 && 'bottom-right',
            childrenEnd: shownNewGoods ? CartControlNewItem : CartControlContent,
            childrenEndProps: {
              goods,
              goodsCount,
              name: goodsName,
            },
            childrenIn: true,
            borderRadius: true,
          }}
          onClick={closeNewGoods}
        >
          <CartIcon color={color} />
          <NotificationCount className={styles.notificationCount} count={goodsCount} withCount />
        </Button>
      </div>
    </MarketplaceBlockDisabledLayout>
  );
}

export default connect((state) => ({
  addToCartLastDate: state.MarketplaceCartReducer.addToCartLastDate,
  cartInfo: state.MarketplaceCartReducer.cartInfo,
}))(CartControl);
