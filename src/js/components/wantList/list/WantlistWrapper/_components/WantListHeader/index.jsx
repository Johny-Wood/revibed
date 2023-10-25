import classNames from 'classnames';

import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import WantListPlanDetails from '@/components/wantList/list/WantListReleases/_components/WantListPlanDetails';

import styles from './styles.module.scss';

function WantListHeader({ className, planClassName, children }) {
  return (
    <div className={classNames(styles.wantListHeader, className)}>
      <div className={classNames(styles.wantListHeader__plan, planClassName, 'w-100pct f-x-between f-y-center m-top-15')}>
        <DesktopLayout>{children}</DesktopLayout>
        <WantListPlanDetails />
      </div>
    </div>
  );
}

export default WantListHeader;
