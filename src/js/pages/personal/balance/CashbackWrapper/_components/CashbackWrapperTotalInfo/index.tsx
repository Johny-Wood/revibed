import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import Coin from '@/components/ui/currency/Coin';
import Preloader from '@/components/ui/Preloader';
import type { RootState } from '@/js/redux/reducers';
import CashbackWrapperTotalInfoSlots from '@/pages/personal/balance/CashbackWrapper/_components/CashbackWrapperTotalInfo/_components/CashbackWrapperTotalInfoSlots';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

const CashbackWrapperTotalInfo = ({
  variablesList: {
    PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT,
    PROJECT_FOUNDER_CONTRIBUTION_PRICE,
    PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT,
    PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE,
  } = {},
  getPersonalCashbackInProcess,
  getPersonalCashbackFromApi,
  personalCashback: {
    totalEarned = 0,
    founderProcess: { targets: founderTargets = [], currentPartsCount: founderCurrentPartsCount = 0 } = {},
    contributorProcess: { targets: contributorTargets = [], currentPartsCount: contributorCurrentPartsCount = 0 } = {},
  } = {},
}: PropsFromRedux) => (
  <div className={classNames(styles.CashbackWrapperTotalInfo)}>
    <Preloader isShown={getPersonalCashbackInProcess && !getPersonalCashbackFromApi} opacity={1} withOffsets={false} />
    <div className={classNames(styles.CashbackWrapperTotalInfo__item)}>
      <b className={classNames(styles.CashbackWrapperTotalInfo__description)}>Total cashback earned:</b>
      <Coin className={styles.CashbackWrapperTotalInfo__total} afterText={floatWithCommaFixedUtil(totalEarned)} />
    </div>
    <div className={classNames(styles.CashbackWrapperTotalInfo__content)}>
      <div className={classNames(styles.CashbackWrapperTotalInfo__item)}>
        <b className={classNames(styles.CashbackWrapperTotalInfo__description)}>Founder’s cashback</b>
        <Coin
          className={styles.CashbackWrapperTotalInfo__total}
          afterText={`${floatWithCommaFixedUtil(
            PROJECT_FOUNDER_CONTRIBUTION_PRICE * PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT
          )} for every ${PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT} pre-orders completed as a founder`}
        />
        <CashbackWrapperTotalInfoSlots
          total={PROMOTION_FOUNDER_POINT_TO_COINS_COEFFICIENT}
          value={founderCurrentPartsCount}
          type="founder"
          targets={founderTargets}
        />
      </div>
      <div className={classNames(styles.CashbackWrapperTotalInfo__item)}>
        <b className={classNames(styles.CashbackWrapperTotalInfo__description)}>Contributor’s cashback</b>
        <Coin
          className={styles.CashbackWrapperTotalInfo__total}
          afterText={`${floatWithCommaFixedUtil(
            PROJECT_CONTRIBUTOR_CONTRIBUTION_PRICE
          )} for every ${PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT} pre-orders completed as a contributor`}
        />
        <CashbackWrapperTotalInfoSlots
          total={PROMOTION_CONTRIBUTOR_POINT_TO_COINS_COEFFICIENT}
          value={contributorCurrentPartsCount}
          type="contributor"
          targets={contributorTargets}
        />
      </div>
    </div>
  </div>
);

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
  getPersonalCashbackInProcess: state.CashbackReducer.getPersonalCashbackInProcess,
  getPersonalCashbackFromApi: state.CashbackReducer.getPersonalCashbackFromApi,
  personalCashback: state.CashbackReducer.personalCashback,
}));

export default connector(CashbackWrapperTotalInfo);
