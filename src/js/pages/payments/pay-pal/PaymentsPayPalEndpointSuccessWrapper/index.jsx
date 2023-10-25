import { connect } from 'react-redux';

import PaymentSuccessWrapper from '@/pages/payments/PaymentSuccessWrapper';
import { payPalPaymentExecuteRequestAction } from '@/redux-actions/personal/paymentsActions';

function PaymentsPayPalEndpointSuccessWrapper({ payPalPaymentExecuteInProcess, payPalPaymentExecuteRequest }) {
  return <PaymentSuccessWrapper inProcess={payPalPaymentExecuteInProcess} request={payPalPaymentExecuteRequest} />;
}

export default connect(
  (state) => ({
    payPalPaymentExecuteInProcess: state.PaymentsReducer.payPalPaymentExecuteInProcess,
  }),
  (dispatch) => ({
    payPalPaymentExecuteRequest: (params) => payPalPaymentExecuteRequestAction(params)(dispatch),
  })
)(PaymentsPayPalEndpointSuccessWrapper);
