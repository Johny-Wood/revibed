import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import type { TabConfig } from '@/components/common/tabs/TabsNavigation';
import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';
import type { RootState } from '@/js/redux/reducers';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

const BALANCE_TABS = (ISSUANCE_OF_CASHBACK_ENABLED: string): TabConfig[] => [
  {
    id: 1,
    title: 'Recent activity',
    keyMenu: 'BALANCE',
    href: RoutePathsConstants.BALANCE,
  },
  {
    id: 2,
    title: 'Top up',
    keyMenu: 'TOP_UP',
    href: RoutePathsConstants.TOP_UP_BALANCE,
  },
  {
    id: 3,
    title: 'Withdraw funds',
    keyMenu: 'WITHDRAW',
    href: RoutePathsConstants.WITHDRAW,
    keyMenuNotification: PersonalNotificationsSectionsConstants.WITHDRAW,
  },
  {
    id: 4,
    title: 'Cashback',
    keyMenu: 'CASHBACK',
    href: RoutePathsConstants.CASHBACK,
    keyMenuNotification: PersonalNotificationsSectionsConstants.CASHBACK,
    hide: !ISSUANCE_OF_CASHBACK_ENABLED,
  },
];

const BalanceTabs = ({ variablesList: { ISSUANCE_OF_CASHBACK_ENABLED } }: PropsFromRedux) => (
  <TabsWrapper
    tabs={BALANCE_TABS(ISSUANCE_OF_CASHBACK_ENABLED)}
    type="NAVIGATION"
    withButtonBorder={false}
    withOffsetBottom={false}
    className={styles.balanceTabs}
    horizontalScrollLayoutClassName={styles.balanceTabs__horizontalScrollLayout}
  />
);

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
}));

export default connector(BalanceTabs);
