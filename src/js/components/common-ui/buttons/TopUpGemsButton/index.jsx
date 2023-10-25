import { useMemo } from 'react';

import flatten from 'lodash/flatten';
import { connect } from 'react-redux';

import TopUpBalanceButton from '@/components/common-ui/buttons/TopUpBalanceButton';

import styles from './styles.module.scss';

function TopUpGemsButton({ rounded, loadPersonalTopUpBalanceList, children, onClick }) {
  const hasGemTariff = useMemo(
    () =>
      flatten(Object.values(loadPersonalTopUpBalanceList) || []).filter(({ bonus: { type } = {} }) => type === 'GEM').length > 0,
    [loadPersonalTopUpBalanceList]
  );

  if (!hasGemTariff) {
    return children || null;
  }

  return <TopUpBalanceButton rounded={rounded} text="Buy gems" className={styles.topUpGemsButton} onClick={onClick} />;
}

export default connect((state) => ({
  loadPersonalTopUpBalanceList: state.BalanceReducer.loadPersonalTopUpBalanceList,
}))(TopUpGemsButton);
