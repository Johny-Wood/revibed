import ProjectPriceDetails from '@/components/projects/Project/_components/ProjectPriceDetails';
import ProjectBalanceTable from '@/components/tables/ProjectBalanceTable';
import Coin from '@/components/ui/currency/Coin';
import ToolTip from '@/components/ui/ToolTip';
import ComponentsCommonConstants from '@/constants/components/common';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ProjectBalance({ projectId, balance, priceInfo, lateEntryInfo, estimatedPriceInfo, priceInfo: { total } = {} }) {
  const { isLaptop, isTablet } = ViewportHook();

  return (
    <div className={styles.projectCardBalance}>
      <div className={styles.projectCardBalance__info}>
        <div className={styles.projectCardBalance__price}>
          <div>Pre-order price:&nbsp;</div>
          <div className={styles.projectCardBalance__value}>
            <Coin size={15} type="xl">
              <b>{floatWithCommaFixedUtil(total)}</b>
            </Coin>
            <ToolTip
              size={ComponentsCommonConstants.Size.NORMAL}
              borderRadius={false}
              position={isLaptop ? 'right' : isTablet && 'bottom-right'}
            >
              <ProjectPriceDetails priceInfo={priceInfo} estimatedPriceInfo={estimatedPriceInfo} />
            </ToolTip>
          </div>
        </div>
        <div className={styles.projectCardBalance__balance}>
          <div>Pre-order balance:&nbsp;</div>
          <Coin size={15} type="xl">
            <b>{floatWithCommaFixedUtil(balance)}</b>
          </Coin>
        </div>
      </div>
      <ProjectBalanceTable projectId={projectId} lateEntryInfo={lateEntryInfo} />
    </div>
  );
}

export default ProjectBalance;
