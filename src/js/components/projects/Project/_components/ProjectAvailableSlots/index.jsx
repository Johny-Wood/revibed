import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import { connect } from 'react-redux';

import Gem from '@/components/ui/currency/Gem';
import GoldenCoin from '@/components/ui/currency/GoldenCoin';
import LateEntrySlotTypesConstants from '@/constants/lateEntry/slot-types';
import { availableSlotsUtil } from '@/utils/project/projectUseBonusesUtil';

import styles from './styles.module.scss';

const renderSlots = ({ projectId, slots }) => {
  const GOLDEN_COIN = orderBy(slots.filter(({ type }) => type === LateEntrySlotTypesConstants.GOLDEN_COIN) || []);
  const GEM = orderBy(slots.filter(({ type }) => type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR) || []);

  return (
    <>
      {GOLDEN_COIN.length > 0 &&
        (GOLDEN_COIN.length > 3 ? range(1) : GOLDEN_COIN).map((item, idx) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`project-available-slot-golden-coin-${projectId}-${idx}`}
            className={styles.projectAvailableSlots__item}
          >
            <GoldenCoin size={16} afterText={GOLDEN_COIN.length > 3 ? `x${GOLDEN_COIN.length}` : ''} />
          </div>
        ))}
      {GEM.length > 0 &&
        (GEM.length > 3 ? range(1) : GEM).map((item, idx) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`project-available-slot-gem-${projectId}-${idx}`}
            className={styles.projectAvailableSlots__item}
          >
            <Gem size={16} afterText={GEM.length > 3 ? `x${GEM.length}` : ''} />
          </div>
        ))}
    </>
  );
};

function ProjectAvailableSlots({
  projectId,
  lateEntryInfo: { available, slots = [] } = {},
  userInfo: { gemsCount = 0, goldenCoinsCount = 0 } = {},
  userIsAuthorized,
  className,
}) {
  const availableSlots = availableSlotsUtil({
    userIsAuthorized,
    slots,
    gemsCount,
    goldenCoinsCount,
  });

  if (!available || availableSlots.length === 0) {
    return null;
  }

  return (
    <div className={classNames([styles.projectAvailableSlots, className])}>
      Available:
      {renderSlots({ projectId, slots: availableSlots })}
    </div>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  userInfo: state.AuthReducer.userInfo,
}))(ProjectAvailableSlots);
