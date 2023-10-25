import classNames from 'classnames';
import { connect } from 'react-redux';

import CoinAndBonusCounts from '@/components/common/CoinAndBonusCounts';
import DateFormatDDMMYYYY from '@/components/common/date/DateFormatDDMMYYYY';
import Table from '@/components/ui/Table';
import { PaymentStatusesConstants } from '@/constants/payment/statuses';
import { PaymentSystemLabelsConstants } from '@/constants/payment/systemLabels';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowPointerIcon from '@/icons/arrows/ArrowPointerIcon';
import { loadPaymentHistoryRequestAction } from '@/redux-actions/personal/paymentsActions';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function PaymentHistoryTable({
  loadPaymentHistoryInProcess,
  loadPaymentHistoryFromApi,
  paymentHistory,
  paymentHistoryPageSettings: { page: { totalElements, totalPages, currentNumber, size: pageSize } = {} } = {},
  loadPaymentHistoryRequest,
}) {
  const { isNotDesktop } = ViewportHook();

  const renderStatus = ({ status = '' }) => (
    <span className={classNames(['t-capitalize', `c-${status.toLowerCase()}`])}>{PaymentStatusesConstants[status]}</span>
  );

  const itemMapper = ({ id, system, createdAt, amount, coinsCount, bonusInfo, status, payload: { payInfo } = {} }) => [
    {
      key: `${id}-1`,
      component: <span className="t-semi-bold">#{id}</span>,
    },
    {
      key: `${id}-2`,
      component: (
        <span className="payment-history__system f-y-center f-wrap w-100pct">
          {PaymentSystemLabelsConstants[system]}
          {payInfo && (
            <span className="email f-y-center">
              &nbsp;(
              <span className="t-ellipsis w-auto" style={{ maxWidth: '12em' }} title={payInfo}>
                {payInfo}
              </span>
              )
            </span>
          )}
        </span>
      ),
    },
    {
      key: `${id}-3`,
      component: (
        <>
          <CoinAndBonusCounts coinsCount={coinsCount} bonus={bonusInfo} withComma />
          &nbsp;
          <span className="rotate-90-minus m-left-5 m-right-5">
            <ArrowPointerIcon color="var(--color__black)" />
          </span>
          &nbsp;
          {floatWithCommaFixedUtil(amount)}
          &euro;
        </>
      ),
    },
    {
      key: `${id}-4`,
      component: <DateFormatDDMMYYYY date={createdAt} />,
    },
    {
      key: `${id}-5`,
      component: <>{renderStatus({ status })}</>,
    },
  ];

  return (
    <div className={styles.paymentHistory}>
      <Table
        title="Payment History"
        inProcess={loadPaymentHistoryInProcess}
        items={paymentHistory.map(itemMapper)}
        withFieldName={isNotDesktop}
        headerColumns={[
          {
            key: 1,
            name: 'Description',
            align: 'start',
            width: 130,
            grow: 1,
          },
          {
            key: 2,
            name: 'Payment method',
            align: 'start',
            width: 250,
          },
          {
            key: 3,
            name: 'Amount',
            align: 'end',
            width: 230,
          },
          {
            key: 4,
            name: 'Date',
            align: 'end',
            width: 110,
          },
          {
            key: 5,
            name: 'Status',
            align: 'end',
            width: 110,
          },
        ]}
        scrollId={ScrollBlockIdConstants.PAYMENT_HISTORY}
        route={RoutePathsConstants.TOP_UP_BALANCE}
        withFirstLoad
        requestFromApi={loadPaymentHistoryFromApi}
        withPaginationControl
        pagination={{
          size: pageSize,
          currentNumber,
          totalElements,
          totalPages,
          location: 'PAYMENT_HISTORY',
          withPageSizeMobile: !isNotDesktop,
          onLoadRequest: loadPaymentHistoryRequest,
        }}
        scrollSecondOffset={20}
      />
    </div>
  );
}

export default connect(
  (state) => ({
    loadPaymentHistoryInProcess: state.PaymentsReducer.loadPaymentHistoryInProcess,
    loadPaymentHistoryFromApi: state.PaymentsReducer.loadPaymentHistoryFromApi,
    paymentHistory: state.PaymentsReducer.paymentHistory,
    paymentHistoryPageSettings: state.PaymentsReducer.paymentHistoryPageSettings,
  }),
  (dispatch) => ({
    loadPaymentHistoryRequest: (params = {}) => loadPaymentHistoryRequestAction({ ...params, dispatch }),
  })
)(PaymentHistoryTable);
