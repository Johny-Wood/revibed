import { connect } from 'react-redux';

import PaymentCancelWrapper from '@/pages/payments/PaymentCancelWrapper';
import { payPalPaymentCancelRequestAction } from '@/redux-actions/personal/paymentsActions';

function PaymentsPayPalEndpointCancelWrapper({ payPalPaymentCancelInProcess, payPalPaymentCancelRequest }) {
  return <PaymentCancelWrapper inProcess={payPalPaymentCancelInProcess} request={payPalPaymentCancelRequest} />;
}

export default connect(
  (state) => ({
    payPalPaymentCancelInProcess: state.PaymentsReducer.payPalPaymentCancelInProcess,
  }),
  (dispatch) => ({
    payPalPaymentCancelRequest: (params) => payPalPaymentCancelRequestAction(params)(dispatch),
  })
)(PaymentsPayPalEndpointCancelWrapper);
