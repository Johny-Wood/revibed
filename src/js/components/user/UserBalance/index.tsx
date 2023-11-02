import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import Coin from '@/components/ui/currency/Coin';
import type { RootState } from '@/js/redux/reducers';
import { floatWithCommaUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

type UserBalanceProps = PropsFromRedux & {
  textSize?: number;
  withLabel?: boolean;
  className?: string;
  koinClassName?: string;
  valueClassName?: string;
};

function UserBalance({
  userInfo: { balance = 0 } = {},
  textSize,
  withLabel = false,
  className,
  koinClassName,
  valueClassName,
}: UserBalanceProps) {
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

const connector = connect((state: RootState) => ({
  userInfo: state.AuthReducer.userInfo,
}));

export default connector(UserBalance);
