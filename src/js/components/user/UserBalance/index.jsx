import classNames from 'classnames';
import { connect } from 'react-redux';

import Coin from '@/components/ui/currency/Coin';
import { floatWithCommaUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function UserBalance({ userInfo: { balance = 0 } = {}, textSize, withLabel = false, className, koinClassName, valueClassName }) {
  return (
    <div className={classNames(styles.userBalance, className)}>
      <div className={classNames(styles.userBalance__koin, koinClassName)}>
        {withLabel && <b className={styles.userBalance__title}>Balance:</b>}
        <span className={classNames(styles.userBalance__value, valueClassName, `text_size_${textSize}`)}>
          <Coin afterText={floatWithCommaUtil(balance)} />
        </span>
      </div>
    </div>
  );
}

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(UserBalance);
