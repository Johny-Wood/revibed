import { connect } from 'react-redux';

import Table from '@/components/ui/Table';
import NickName from '@/components/user/NickName';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { loadProjectBalanceRequestAction } from '@/redux-actions/project/projectBalanceActions';
import { normalizeDateUtilAgoUtil } from '@/utils/dateUtils';
import { floatWithCommaFixedUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const additionalExpenses = ({ comment }) => (
  <>
    <b>Additional costs</b>
    {comment ? ` (${comment})` : ''}
  </>
);

const lateEntrySystemShare = ({ systemCutsCount }) => (
  <>
    {systemCutsCount}
    &nbsp;
    {textForLotsOfUtil(systemCutsCount, ['cut', 'cuts'])} reserved for late entry
  </>
);

const DEFAULT_OPERATION_NAME = 'System transaction';

const operationToActionName = ({ userName, userId, pct, ...payload }, comment, { lateEntryInfo: { systemCutsCount } = {} }) => ({
  PROJECT_MEDIA_PURCHASE_PRICE_SHIPPING: 'Shipping charge',
  PROJECT_MEDIA_PURCHASE_PRICE_BUY: 'Record purchased',
  PROJECT_MEDIA_PURCHASE_CUSTOMS_TAX: 'Taxes charge',
  PROJECT_FREEZING_COMMISSIONS_INSURANCE: 'Insurance fee',
  PROJECT_FREEZING_COMMISSIONS_COMMISSION: 'Commission fee',
  PROJECT_RELEASE_COPYRIGHT_HOLDER_FUND: 'Pre-order artist fund',
  PROJECT_SOLD_MEDIA_PRICE_SHIPPING: 'Charge for shipping record to buyer',
  PROJECT_SOLD_MEDIA_PRICE_SOLD: 'Record sold',
  PROJECT_SOLD_MEDIA_RIPPER_COMPENSATION_SHIPPING: 'Shipping',
  PROJECT_SOLD_MEDIA_DISCOGS_COMMISSION: 'Discogs fee',
  PROJECT_SOLD_MEDIA_PAY_PAL_COMMISSION: 'PayPal fee',
  PROJECT_SOLD_MEDIA_FREEZE_PRICE_SHIPPING: 'Shipping',
  PROJECT_SOLD_MEDIA_RIPPER_COMPENSATION_PACKING_COST: 'Packing cost',
  PROJECT_REFUND_CONTRIBUTOR: (
    <>
      Funds distributed
      {!!userName && (
        <>
          &nbsp;to <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
          &nbsp;
        </>
      )}
    </>
  ),
  PROJECT_REFUND_UNALLOCATED: 'Write-off of unallocated funds',
  SHARE_BUYOUT_FOR_LATE_ENTRY: lateEntrySystemShare({ systemCutsCount }),
  SHARE_BUYOUT_FOR_LATE_ENTRY_BEFORE_CLOSE: lateEntrySystemShare({
    systemCutsCount: payload?.systemCutsCount,
  }),
  USER_BUY_CUT_IN_PROJECT: (
    <>
      <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
      &nbsp;
      <br />
      bought&nbsp;
      {pct}
      &nbsp;
      {textForLotsOfUtil(pct, ['cut', 'cuts'])}
    </>
  ),
  PUBLISH_PROJECT_FOUNDER_GEM_PERCENT: (
    <>
      <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
      &nbsp;
      <br />
      spent gem for&nbsp;
      {pct}
      &nbsp;
      {textForLotsOfUtil(pct, ['cut', 'cuts'])}
    </>
  ),
  PUBLISH_PROJECT_FOUNDER_GOLDEN_COIN_PERCENT: (
    <>
      <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
      &nbsp;
      <br />
      spent golden koin for&nbsp;
      {pct}
      &nbsp;
      {textForLotsOfUtil(pct, ['cut', 'cuts'])}
    </>
  ),
  RIPPER_REWARD: 'Digitization',
  HAND_TRANSFER: 'System transaction',
  ADDED_ADDITIONAL_EXPENSES: additionalExpenses({ comment }),
  PROJECT_ADDITIONAL_EXPENSES_RIPPER: additionalExpenses({ comment }),
  PROJECT_ADDITIONAL_EXPENSES_SYSTEM: additionalExpenses({ comment }),
  PROJECT_REFUND_AFTER_RIP_LINK_CONTRIBUTOR: (
    <>
      Extra funds distributed
      {!!userName && (
        <>
          &nbsp;to <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
          &nbsp;
        </>
      )}
    </>
  ),
  PROJECT_MEDIA_PURCHASE_COMPENSATION: 'Compensation from insurance fund',
  PROJECT_ADDITIONAL_EXPENSES_COMPENSATION: 'Compensation from insurance fund',
  PROJECT_REFUND_FOUNDER_GEM_PERCENT: 'Funds paid by gem',
  PROJECT_CONTRIBUTOR_USE_GOLDEN_COIN: (
    <>
      <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
      &nbsp;
      <br />
      spent golden coin for&nbsp;
      {pct}
      &nbsp;
      {textForLotsOfUtil(pct, ['cut', 'cuts'])}
    </>
  ),
  PROJECT_CONTRIBUTOR_USE_GEM: (
    <>
      <NickName isRoute name={userName} userId={userId} fontWeight="bold" />
      &nbsp;
      <br />
      spent gem for&nbsp;
      {pct}
      &nbsp;
      {textForLotsOfUtil(pct, ['cut', 'cuts'])}
    </>
  ),
  PROJECT_REFUND_CONTRIBUTORS_GOLDEN_COIN_SHARE: 'Funds paid by golden coin',
  PROJECT_REFUND_SYSTEM_SHARE_FOR_LATE_ENTRY: 'Funds distributed to system',
  PROJECT_REFUND: 'Refund',
  PROJECT_REFUND_FROM_INSURANCE: 'Refund',
});

const prefixByOperation = (type) => {
  switch (type) {
    case 'DOWN':
      return '-';
    case 'UP':
    default:
      return '';
  }
};

const itemMapper = ({ id, operation, date, sum, type, comment, payload = {} }, { lateEntryInfo }) => [
  {
    key: `${id}1`,
    fieldType: type,
    withDirectionArrow: true,
    component: <span>{operationToActionName(payload, comment, { lateEntryInfo })[operation] || DEFAULT_OPERATION_NAME}</span>,
  },
  {
    key: `${id}2`,
    component: normalizeDateUtilAgoUtil(date),
  },
  {
    key: `${id}3`,
    fieldType: type,
    withColor: true,
    component: (
      <>
        {prefixByOperation(type)}
        {floatWithCommaFixedUtil(sum)}
      </>
    ),
  },
];

function ProjectBalanceTable({
  projectId,
  projectBalance,
  lateEntryInfo,
  loadProjectBalanceInProcess,
  projectBalancePageSettings,
  loadProjectBalanceRequest,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <Table
      name={styles.projectBalanceTable}
      items={projectBalance.map((item) => itemMapper(item, { lateEntryInfo }))}
      withHeaderOnly
      headerColumns={[
        {
          key: 1,
          name: 'Action',
          align: 'start',
          width: 350,
          grow: 1,
        },
        {
          key: 2,
          name: 'Date',
          align: 'end',
          width: 130,
        },
        {
          key: 3,
          name: 'Amount',
          align: 'end',
          width: 140,
        },
      ]}
      inProcess={loadProjectBalanceInProcess}
      scrollId={ScrollBlockIdConstants.PROJECT_BALANCE}
      route={RoutePathsConstants.PROJECT}
      withFirstLoad
      withPaginationControl
      pagination={{
        ...projectBalancePageSettings,
        location: 'PROJECT_BALANCE',
        withPageSizeMobile: !isNotDesktop,
        withPagination: true,
        onLoadRequest: loadProjectBalanceRequest,
        requestParams: {
          projectId,
        },
      }}
      itemClassName={styles.tableItem}
      itemElementClassName={styles.tableItem__element}
      bodyTextClassName={styles.tableBody__text}
      headerClassName={styles.tableHeader}
      headerElementClassName={styles.tableHeader__element}
      headerTextClassName={styles.tableHeader__text}
    />
  );
}

export default connect(
  (state) => ({
    loadProjectBalanceInProcess: state.ProjectBalanceReducer.loadProjectBalanceInProcess,
    projectBalance: state.ProjectBalanceReducer.projectBalance,
    projectBalancePageSettings: state.ProjectBalanceReducer.projectBalancePageSettings,
  }),
  (dispatch) => ({
    loadProjectBalanceRequest: (params) => loadProjectBalanceRequestAction(params)(dispatch),
  })
)(ProjectBalanceTable);
