import classNames from 'classnames';

import styles from './styles.module.scss';

function CartControlNewItem({ name }) {
  return (
    <div className={classNames(styles.cartControl__goods, 't-center')}>
      <b className="t-ellipsis w-auto">{name}</b>
      <br />
      <span> was added to cart</span>
    </div>
  );
}

export default CartControlNewItem;
