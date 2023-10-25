import { connect } from 'react-redux';

import PaymentCancelWrapper from '@/pages/payments/PaymentCancelWrapper';
import { stripePaymentCancelRequestAction } from '@/redux-actions/personal/paymentsActions';

function PaymentsStripeEndpointCancelWrapper({ stripePaymentCancelInProcess, stripePaymentCancelRequest }) {
  return <PaymentCancelWrapper inProcess={stripePaymentCancelInProcess} request={stripePaymentCancelRequest} />;
}

export default connect(
  (state) => ({
    stripePaymentCancelInProcess: state.PaymentsReducer.stripePaymentCancelInProcess,
  }),
  (dispatch) => ({
    stripePaymentCancelRequest: (params) => stripePaymentCancelRequestAction(params)(dispatch),
  })
)(PaymentsStripeEndpointCancelWrapper);
