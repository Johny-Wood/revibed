import classNames from 'classnames';

import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import CartIcon from '@/icons/marketplace/CartIcon';

import styles from './styles.module.scss';

function CartNoItems({ withIcon, className, titleClassName }) {
  return (
    <div className={classNames(styles.cartWrapperNoItems, className)}>
      {withIcon && <CartIcon />}
      <p className={classNames(titleClassName, 'c-gray-2 m-top-30')}>There are no items in your basket</p>
      <LinkRoute
        href={RoutePathsConstants.MARKETPLACE}
        text="Keep shopping"
        className={classNames(styles.cartWrapperNoItems__link, 't-bold')}
      />
    </div>
  );
}

export default CartNoItems;
