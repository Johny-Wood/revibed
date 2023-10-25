import { connect } from 'react-redux';

import PaymentSuccessWrapper from '@/pages/payments/PaymentSuccessWrapper';
import { stripePaymentExecuteRequestAction } from '@/redux-actions/personal/paymentsActions';

function PaymentsStripeEndpointSuccessWrapper({ stripePaymentExecuteInProcess, stripePaymentExecuteRequest }) {
  return <PaymentSuccessWrapper inProcess={stripePaymentExecuteInProcess} request={stripePaymentExecuteRequest} />;
}

export default connect(
  (state) => ({
    stripePaymentExecuteInProcess: state.PaymentsReducer.stripePaymentExecuteInProcess,
  }),
  (dispatch) => ({
    stripePaymentExecuteRequest: (params) => stripePaymentExecuteRequestAction(params)(dispatch),
  })
)(PaymentsStripeEndpointSuccessWrapper);
