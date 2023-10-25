import { connect } from 'react-redux';

import DateFormatDDMMYYYY from '@/components/common/date/DateFormatDDMMYYYY';
import Coin from '@/components/ui/currency/Coin';
import Table from '@/components/ui/Table';
import ToolTip from '@/components/ui/ToolTip';
import NickName from '@/components/user/NickName';
import UserAvatar from '@/components/user/UserAvatar';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { getReferralRequestAction } from '@/redux-actions/personal/referralActions';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const itemMapper = ({
  id,
  user: { id: userId, name: userName, avatar: userAvatar } = {},
  regDate,
  actionCompleted,
  reward: { sum } = {},
}) => [
  {
    key: `${id}-1`,
    component: (
      <span className="f-y-center w-100pct">
        <UserAvatar src={userAvatar} userId={userId} isRoute size={35} />
        <NickName name={userName} withFlag={false} fontWeight="semi-bold" userId={userId} isRoute />
      </span>
    ),
  },
  {
    key: `${id}-2`,
    component: (
      <span className="f-y-center w-100pct">
        <DateFormatDDMMYYYY date={regDate} />
      </span>
    ),
  },
  {
    key: `${id}-3`,
    component: (
      <div className="f-y-center">
        {sum >= 0 && (
          <Coin size={12} offset={false}>
            {floatWithCommaFixedUtil(sum)}
          </Coin>
        )}
        {!sum && actionCompleted && <span className="c-green">Completed</span>}
        {!sum && !actionCompleted && (
          <ToolTip
            size={ComponentsCommonConstants.Size.SMALL}
            borderRadius={false}
            className="m-0"
            width={210}
            button={() => <span className="c-gray-3">Pending</span>}
            position="top-right"
          >
            Conditions have not been executed yet.
          </ToolTip>
        )}
      </div>
    ),
  },
];

function ReferralHistoryTable({
  section,
  referralHistory = [],
  referralHistoryPageSettings: { page: { totalElements, totalPages, size, currentNumber = 0 } = {} } = {},
  getReferralHistoryFromApi,
  getReferralHistoryInProcess,
  getReferralRequest,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <Table
      title="My invites"
      name={styles.referralTable}
      wrapperClassName={styles.referralTableWrapper}
      inProcess={getReferralHistoryInProcess}
      withFieldName={isNotDesktop}
      items={referralHistory.map(itemMapper)}
      headerColumns={[
        {
          key: 1,
          name: 'Username',
          align: 'start',
          width: 400,
          grow: 1,
        },
        {
          key: 2,
          name: 'Sign up date',
          align: 'start',
          width: 200,
        },
        {
          key: 3,
          name: 'Reward',
          align: 'end',
          width: 150,
        },
      ]}
      scrollId={ScrollBlockIdConstants.INVITES}
      route={RoutePathsConstants.INVITES}
      withFirstLoad
      requestFromApi={getReferralHistoryFromApi}
      withPaginationControl
      pagination={{
        size,
        currentNumber,
        totalElements,
        totalPages,
        location: 'REFERRAL',
        withPageSizeMobile: !isNotDesktop,
        withPagination: true,
        onLoadRequest: getReferralRequest,
      }}
      withFirstScroll={section === 'referral'}
      bodyTextClassName={styles.tableBody__text}
      itemClassName={styles.tableItem}
    />
  );
}

export default connect(
  (state) => ({
    getReferralHistoryFromApi: state.ReferralReducer.getReferralHistoryFromApi,
    getReferralHistoryInProcess: state.ReferralReducer.getReferralHistoryInProcess,
    referralHistoryPageSettings: state.ReferralReducer.referralHistoryPageSettings,
    referralHistory: state.ReferralReducer.referralHistory,
  }),
  (dispatch) => ({
    getReferralRequest: (params) => getReferralRequestAction({ ...params, dispatch }),
  })
)(ReferralHistoryTable);
