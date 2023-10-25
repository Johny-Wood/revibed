import classNames from 'classnames';
import parse from 'html-react-parser';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import DateFormatDDMMYYYY from '@/components/common/date/DateFormatDDMMYYYY';
import EventMarker from '@/components/events/EventMarker';
import EventsWrapper from '@/components/events/EventsWrapper';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import Coin from '@/components/ui/currency/Coin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import Table from '@/components/ui/Table';
import { CommonNavigationsConstants } from '@/constants/common/navigation';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { loadPersonalBalanceRequestAction, personalBalanceSortSelectedAction } from '@/redux-actions/personal/balanceActions';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';
import { floatWithCommaFixedUtil, parseReplaceTextUtil, splitTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const operationToActionName = {
  USER_TOP_UP_BALANCE: 'Top up',
  USER_BUY_CUT_IN_PROJECT: 'Cuts purchases',
  FROZEN_FOUNDER_CUT_PRICE: 'Funds held on&nbsp;Project creation',
  REFUND_FROZEN_FOUNDER_CUT: 'Project rejection refund',
  SOLD_MEDIA: 'Media sold',
  RIPPER_REWARD: 'Archive copy fee',
  PROJECT_CLOSED: 'Funds distribution',
  REFUND_INVESTED_AFTER_SOLD: 'Funds distribution',
  HAND_TRANSFER: 'System transaction (funds debited or&nbsp;credited manually by&nbsp;admin)',
  USER_BUY_WANTLIST_PLAN: 'Wantlist subscription fee',
  FREEZING_WITHDRAW_FUNDS: 'Funds held pending withdrawal',
  RETURN_WITHDRAW_FREEZING_FUNDS: 'Funds returned to balance (withdrawal request rejected)',
  PROMO_BLACK_CAT_CARD_REWARD: 'Reward for Blackcatcard',
  REFERRAL_PROGRAM_REWARD: 'Referred Friend Bonus',
  REFUND_INVESTED_AFTER_ADDED_RIP_LINK: 'Extra funds distribution',
  MARKETPLACE_PURCHASE_GOODS: 'Purchase goods',
  USER_ROYALTY_OUTPUT: 'Royalty output',
  PARTNER_PROGRAM_PROMO_REWARD: 'Reward for',
  ADDED_ADDITIONAL_EXPENSES: 'Additional costs',
  CASHBACK_FOR_PROJECTS: 'Cashback',
};

const prefixByOperation = (type) => {
  switch (type) {
    case 'DOWN':
      return '-';
    case 'UP':
    default:
      return '';
  }
};

const renderProjectName = ({ projectTitle, projectId, text }) => {
  if (!projectTitle) {
    return null;
  }

  return (
    <span className="t-semi-bold">
      <DesktopLayout>&nbsp;&nbsp;(</DesktopLayout>
      {projectId >= 0 ? (
        <LinkRoute href={createProjectUrlUtil(projectId, projectTitle)} text={text} title={projectTitle} />
      ) : (
        <span title={projectTitle}>{text}</span>
      )}
      <DesktopLayout>)</DesktopLayout>
    </span>
  );
};

const renderPurchaseLink = ({ orderId, text }) => {
  if (!orderId) {
    return null;
  }

  return (
    <span className="t-semi-bold">
      <DesktopLayout>&nbsp;&nbsp;(</DesktopLayout>
      <LinkRoute href={parseReplaceTextUtil(RoutePathsConstants.PERSONAL_PURCHASE, orderId)} text={text} />
      <DesktopLayout>)</DesktopLayout>
    </span>
  );
};

const renderPromoActionName = ({ promoActionName }) => {
  if (!promoActionName) {
    return null;
  }

  return (
    <span className="t-semi-bold">
      <DesktopLayout>&nbsp;&nbsp;</DesktopLayout>
      {promoActionName}
    </span>
  );
};

const itemMapper = (
  { id, operation, date, sum, type, payload: { projectId, projectTitle, orderId, promoActionName } = {} },
  { isNotDesktop, unreadEvents = {}, variablesList: { UNREAD_MARKER_BALANCE_ENABLED } = {} }
) => {
  const { [CommonNavigationsConstants.BALANCE]: unreadEventsBalance = {} } = unreadEvents[0] || {};
  const isUnreadEvent = Object.keys(unreadEventsBalance).includes(`${id}`);
  const operationName = operationToActionName[operation] || '';

  return [
    {
      key: `user-balance-${id}-1`,
      fieldType: type,
      withDirectionArrow: true,
      component: (
        <div className="f_direction_column_mobile">
          {parse(operationName)}
          {renderPromoActionName({ promoActionName })}
          {renderPurchaseLink({
            orderId,
            text: `order: #${orderId}`,
          })}
          {renderProjectName({
            projectTitle,
            projectId,
            text: `${splitTextUtil(projectTitle, isNotDesktop ? 30 : 70 - operationName.length).introText}`,
          })}
        </div>
      ),
    },
    {
      key: `user-balance-${id}-2`,
      component: (
        <span className={classNames(globalStyles.relative, 'f-y-center')}>
          <EventMarker className="m-right-5" shown={isUnreadEvent && UNREAD_MARKER_BALANCE_ENABLED} />
          <DateFormatDDMMYYYY className={styles.date} date={date} />
        </span>
      ),
    },
    {
      key: `user-balance-${id}-3`,
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
};

const getUnreadEventsList = ({ unreadEvents }) => {
  const { [PersonalNotificationsSectionsConstants.BALANCE]: unreadEventsBalance = {} } = unreadEvents[0] || {};

  return Object.keys(unreadEventsBalance).map((id) => +id);
};

function UserBalanceTable({
  personalBalanceList,
  unreadEvents,
  sortQuery: { createdAt, sum } = {},
  loadPersonalBalanceRequest,
  loadPersonalBalanceInProcess,
  loadedPersonalBalanceFromApi,
  personalBalanceListSettings: { page: { currentNumber = 0, size, totalElements, totalPages } = {} } = {},
  personalBalanceSortSelected,
  variablesList,
}) {
  const { isNotDesktop } = ViewportHook();

  const toggleSort = ({ keyItem, order = {}, items = [], toggle }) => {
    const newSortQuery = {
      [keyItem]: toggle ? order : items.find((item) => item.value === (order.value === 'DESC' ? 'ASC' : 'DESC')),
    };

    personalBalanceSortSelected(newSortQuery);

    loadPersonalBalanceRequest();
  };

  return (
    <EventsWrapper
      location={PersonalNotificationsSectionsConstants.BALANCE}
      deleteFromAllProjects={false}
      eventsIds={getUnreadEventsList({ unreadEvents })}
      isStartDeleteUnreadEventsMarkers={currentNumber + 1}
    >
      <Table
        name={styles.userBalanceTable}
        withFieldName={isNotDesktop}
        items={personalBalanceList.map((item) => itemMapper(item, { isNotDesktop, unreadEvents, variablesList }))}
        headerColumns={[
          {
            key: 1,
            name: 'Activity',
            align: 'start',
            width: 600,
            grow: 1,
          },
          {
            key: 2,
            keyItem: 'createdAt',
            order: createdAt,
            name: 'Date',
            items: [
              {
                id: 1,
                value: 'ASC',
                label: 'Recent to old',
              },
              {
                id: 2,
                value: 'DESC',
                label: 'Old to recent',
              },
            ],
            align: 'end',
            width: 100,
            type: 'SORT',
            onClick: toggleSort,
          },
          {
            key: 3,
            keyItem: 'sum',
            order: sum,
            name: 'Amount',
            items: [
              {
                id: 3,
                value: 'DESC',
                label: 'High to low',
              },
              {
                id: 4,
                value: 'ASC',
                label: 'Low to high',
              },
            ],
            align: 'end',
            width: isNotDesktop ? 75 : 150,
            withIcon: true,
            icon: Coin,
            type: 'SORT',
            onClick: toggleSort,
          },
        ]}
        scrollId={ScrollBlockIdConstants.BALANCE}
        route={RoutePathsConstants.BALANCE}
        withFirstLoad
        inProcess={loadPersonalBalanceInProcess}
        requestFromApi={loadedPersonalBalanceFromApi}
        withPaginationControl
        pagination={{
          size,
          currentNumber,
          totalElements,
          totalPages,
          location: 'HISTORY',
          withPageSizeMobile: !isNotDesktop,
          withPagination: true,
          onLoadRequest: loadPersonalBalanceRequest,
        }}
        scrollSecondOffset={60}
      />
    </EventsWrapper>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
    personalBalanceListSettings: state.BalanceReducer.personalBalanceListSettings,
    personalBalanceList: state.BalanceReducer.personalBalanceList,
    loadPersonalBalanceInProcess: state.BalanceReducer.loadPersonalBalanceInProcess,
    loadedPersonalBalanceFromApi: state.BalanceReducer.loadedPersonalBalanceFromApi,
    sortQuery: state.BalanceReducer.sortQuery,
  }),
  (dispatch) => ({
    loadPersonalBalanceRequest: (params) => loadPersonalBalanceRequestAction({ ...params, dispatch }),
    personalBalanceSortSelected: (sortQuery) => {
      dispatch(personalBalanceSortSelectedAction(sortQuery));
    },
  })
)(UserBalanceTable);
