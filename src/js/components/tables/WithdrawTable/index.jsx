import { memo, useCallback, useState } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import DateFormatDDMMYYYY from '@/components/common/date/DateFormatDDMMYYYY';
import EventMarker from '@/components/events/EventMarker';
import EventsWrapper from '@/components/events/EventsWrapper';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import Table from '@/components/ui/Table';
import ToolTip from '@/components/ui/ToolTip';
import { CommonNavigationsConstants } from '@/constants/common/navigation';
import ComponentsCommonConstants from '@/constants/components/common';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowPointerIcon from '@/icons/arrows/ArrowPointerIcon';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { confirmWithdrawRequestAction, loadWithdrawHistoryRequestAction } from '@/redux-actions/personal/withdrawActions';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const RejectedButton = memo(() => <span className="c-rejected">Rejected</span>);

RejectedButton.displayName = 'RejectedButton';

const WithdrawTable = ({
  withdrawHistory = [],
  loadWithdrawHistoryInProcess,
  loadWithdrawHistoryFromApi,
  loadWithdrawHistoryRequest,
  confirmWithdrawInProcess,
  confirmWithdrawRequest,
  unreadEvents = {},
  ShowMessage,
  withdrawHistoryPageSettings: { page: { totalElements, totalPages, size, currentNumber = 0 } = {} } = {},
}) => {
  const { isNotDesktop } = ViewportHook();

  const [activeConfirmWithdrawId, setActiveConfirmWithdrawId] = useState(-1);

  const renderStatus = useCallback(
    ({ withdrawStatus, textRejection, confirmWithdrawId }) => {
      switch (withdrawStatus) {
        case 'PENDING': {
          return <>Pending</>;
        }
        case 'DONE': {
          return <span className="c-green">Accepted</span>;
        }
        case 'ACCEPTED': {
          const disabledActiveConfirm = activeConfirmWithdrawId === confirmWithdrawId && confirmWithdrawInProcess;

          return (
            <Button
              text="Confirm receipt"
              size={ComponentsCommonConstants.Size.SMALL25}
              isInProcess={disabledActiveConfirm}
              disabled={disabledActiveConfirm}
              onClick={() => {
                if (confirmWithdrawInProcess) {
                  return;
                }

                setActiveConfirmWithdrawId(confirmWithdrawId);

                confirmWithdrawRequest({ confirmWithdrawId })
                  .then(() => {
                    ShowMessage('SuccessMessage', {
                      messageText: 'Withdrawal successfully confirmed',
                    });
                  })
                  .finally(() => {
                    setActiveConfirmWithdrawId(-1);
                  });
              }}
            />
          );
        }
        case 'REJECTED': {
          return (
            <ToolTip borderRadius={false} className="m-0" width={217} button={RejectedButton} position="top-right">
              <span className="t-bold">Rejection reason</span>
              :
              <br />
              {textRejection}
            </ToolTip>
          );
        }
        default: {
          return <>----</>;
        }
      }
    },
    [ShowMessage, activeConfirmWithdrawId, confirmWithdrawInProcess, confirmWithdrawRequest]
  );

  const itemMapper = useCallback(
    ({ id, emailPayPal, createdAt, withdrawalAmount, withdrawStatus, textRejection = '', paidAmount }) => {
      const { [CommonNavigationsConstants.WITHDRAW]: unreadEventsWithdraw = {} } = unreadEvents[0] || {};
      const isUnreadEvent = Object.keys(unreadEventsWithdraw).includes(`${id}`);

      return [
        {
          key: `${id}-1`,
          component: <span className="f-y-center w-100pct t-bold">#{id}</span>,
        },
        {
          key: `${id}-2`,
          component: (
            <span className="t-ellipsis" style={{ maxWidth: '20em' }}>
              {emailPayPal}
            </span>
          ),
        },
        {
          key: `${id}-3`,
          component: (
            <span className="f-y-center f-x-end w-100pct">
              <Coin offset={false} size={12} type="s">
                {floatWithCommaFixedUtil(withdrawalAmount)}
              </Coin>
              &nbsp;
              <span className="rotate-90-minus m-left-5 m-right-5">
                <ArrowPointerIcon color="var(--color__black)" />
              </span>
              &nbsp;
              {floatWithCommaFixedUtil(paidAmount)}
              &euro;
            </span>
          ),
        },
        {
          key: `${id}-4`,
          component: (
            <span className={classNames(globalStyles.relative, 'f-y-center f-x-end w-100pct')}>
              <EventMarker className={styles.eventMarker} shown={isUnreadEvent} />
              <DateFormatDDMMYYYY className={styles.date} date={createdAt} />
            </span>
          ),
        },
        {
          key: `${id}-5`,
          component: (
            <div className="f-y-center">
              {renderStatus({
                withdrawStatus,
                textRejection,
                confirmWithdrawId: id,
              })}
            </div>
          ),
        },
      ];
    },
    [renderStatus, unreadEvents]
  );

  const getUnreadEventsList = useCallback(() => {
    const { [PersonalNotificationsSectionsConstants.WITHDRAW]: unreadEventsWithdraw = {} } = unreadEvents[0] || {};

    return Object.keys(unreadEventsWithdraw).map((id) => +id);
  }, [unreadEvents]);

  return (
    <EventsWrapper
      location={PersonalNotificationsSectionsConstants.WITHDRAW}
      deleteFromAllProjects={false}
      eventsIds={getUnreadEventsList()}
      isStartDeleteUnreadEventsMarkers={currentNumber + 1}
    >
      <Table
        title="Withdrawal History"
        name={styles.userWithdrawTable}
        withFieldName={isNotDesktop}
        items={withdrawHistory.map(itemMapper)}
        headerColumns={[
          {
            key: 1,
            name: 'Withdrawal request',
            align: 'start',
            width: 130,
            grow: 1,
          },
          {
            key: 2,
            keyItem: 'emailPayPal',
            name: 'Paypal account',
            align: 'start',
            width: 240,
          },
          {
            key: 3,
            name: 'Amount',
            align: 'end',
            width: 200,
          },
          {
            key: 4,
            name: 'Date',
            align: 'end',
            width: 100,
          },
          {
            key: 5,
            name: 'Status',
            align: 'end',
            width: 125,
          },
        ]}
        inProcess={loadWithdrawHistoryInProcess}
        scrollId={ScrollBlockIdConstants.WITHDRAW}
        route={RoutePathsConstants.WITHDRAW}
        withFirstLoad
        requestFromApi={loadWithdrawHistoryFromApi}
        withPaginationControl
        pagination={{
          size,
          currentNumber,
          totalElements,
          totalPages,
          location: 'WITHDRAW',
          withPageSizeMobile: !isNotDesktop,
          withPagination: true,
          onLoadRequest: loadWithdrawHistoryRequest,
        }}
        scrollSecondOffset={20}
      />
    </EventsWrapper>
  );
};

export default connect(
  (state) => ({
    loadWithdrawHistoryFromApi: state.WithdrawReducer.loadWithdrawHistoryFromApi,
    confirmWithdrawInProcess: state.WithdrawReducer.confirmWithdrawInProcess,
    withdrawHistoryPageSettings: state.WithdrawReducer.withdrawHistoryPageSettings,
    unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
    loadWithdrawHistoryInProcess: state.WithdrawReducer.loadWithdrawHistoryInProcess,
    withdrawHistory: state.WithdrawReducer.withdrawHistory,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    loadWithdrawHistoryRequest: (params = {}) =>
      loadWithdrawHistoryRequestAction({
        ...params,
        dispatch,
      }),
    confirmWithdrawRequest: ({ confirmWithdrawId }) =>
      confirmWithdrawRequestAction({
        confirmWithdrawId,
        dispatch,
      }),
  })
)(WithdrawTable);
