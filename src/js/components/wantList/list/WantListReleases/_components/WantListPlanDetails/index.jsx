import classNames from 'classnames';
import { connect } from 'react-redux';

import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonMessagesConstants } from '@/constants/common/message';
import { RoutePathsConstants } from '@/constants/routes/routes';
import InfinityIcon from '@/icons/InfinityIcon';

import styles from './styles.module.scss';

function WantListPlanDetails({
  wantListInfo: { plan: { name: planName = '' } = {}, subscriptionInfo: { totalReleases = 0, activeReleases = 0 } = {} } = {},
}) {
  return (
    <div className={classNames(styles.wantListPlanDetails, 'f-y-center')}>
      <div className={styles.wantListPlanDetails__item}>
        <div className="c-gray-2">watch</div>
        <div className={classNames('title_m', activeReleases >= totalReleases && totalReleases !== 0 && 'c-red')}>
          {activeReleases} /{totalReleases || <InfinityIcon />}
        </div>
      </div>
      <DesktopLayout>
        <div className={styles.wantListPlanDetails__item}>
          <div className="c-gray-2">current plan</div>
          <div className="title_m">{planName}</div>
        </div>
      </DesktopLayout>
      <LinkRoute
        href={RoutePathsConstants.WANTLIST_PLAN}
        text={CommonMessagesConstants.UPGRADE_PLAN}
        transparent
        type="button"
        className={classNames(
          styles.wantListPlanDetails__buttonUpgradePlan,
          activeReleases >= totalReleases && totalReleases !== 0 ? 'border-green' : 'border-gray-3'
        )}
        size="small-40"
      />
    </div>
  );
}

export default connect((state) => ({
  wantListInfo: state.WantListReducer.wantListInfo,
}))(WantListPlanDetails);
