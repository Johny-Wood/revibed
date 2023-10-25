import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import CashbackIcon from '@/icons/CashbackIcon';
import type { RootState } from '@/js/redux/reducers';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

const CashbackWrapperBanner = ({ variablesList: { PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT } = {} }: PropsFromRedux) => (
  <div className={classNames(styles.CashbackWrapperBanner)}>
    <span>Get 100% cashback</span>
    <span className={classNames(styles.CashbackWrapperBanner__icon)}>
      <CashbackIcon />
    </span>
    <span>for {PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT}&nbsp;successfully pre-orders as&nbsp;founder</span>
  </div>
);

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(CashbackWrapperBanner);
