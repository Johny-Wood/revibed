import { useCallback, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Preloader from '@/components/ui/Preloader';
import { MessagesIdConstants } from '@/constants/messages/ids';
import { PaymentSystemsConstants } from '@/constants/payment/system';
import { PopupPaymentsIdsConstants, PopupTokenIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';

const paymentSuccess = ({ router, showMessage }) => {
  router.push(RoutePathsConstants.BALANCE);

  showMessage(MessagesIdConstants.PaymentSuccessMessage);
};

function PaymentSuccessWrapper({
  inProcess,
  withToken,
  withRequest,
  system,
  request,

  showPopup,
  showMessage,
}) {
  const getAction = useCallback(() => {
    const { router = {}, router: { router: { query: { token, paymentId, PayerID } = {} } = {} } = {} } = NextRouter.getInstance();

    if (token || !withToken) {
      if (inProcess) {
        return;
      }

      let requestData = { token };

      if (system === PaymentSystemsConstants.PAYPAL) {
        requestData = {
          ...requestData,
          paymentId,
          payerId: PayerID,
        };
      }

      if (withRequest) {
        request(withToken ? requestData : null)
          .then(() => {
            paymentSuccess({ router, showMessage });
          })
          .catch(({ error = {}, payload: { redirectUrl } = {} }) => {
            if (error) {
              handleErrorUtil(error, {
                PAYMENT_HELD: () => {
                  showMessage(PopupPaymentsIdsConstants.PayPalPaymentHeldMessage);
                  router.push(RoutePathsConstants.TOP_UP_BALANCE);
                },
                PAYMENT_ACTION_REQUIRED: () => {
                  router.push(redirectUrl || RoutePathsConstants.TOP_UP_BALANCE);
                },
              });
            } else {
              router.push(RoutePathsConstants.TOP_UP_BALANCE);
            }
          });
      } else {
        paymentSuccess({ router, showMessage });
      }
    } else {
      router.push(RoutePathsConstants.TOP_UP_BALANCE);
      showPopup(PopupTokenIdsConstants.NoSuchTokenPopup);
    }
  }, [inProcess, request, showMessage, showPopup, system, withRequest, withToken]);

  useEffect(() => {
    getAction();
  }, [getAction]);

  return <Preloader id="payment-return" withOffsets={false} isShown color="gray" opacity={1} />;
}

PaymentSuccessWrapper.defaultProps = {
  inProcess: false,
  withToken: true,
  withRequest: true,
  system: PaymentSystemsConstants.PAYPAL,
  request: () => {},
};

PaymentSuccessWrapper.propTypes = {
  inProcess: PropTypes.bool,
  withToken: PropTypes.bool,
  withRequest: PropTypes.bool,
  system: PropTypes.oneOf([PaymentSystemsConstants.PAYPAL, PaymentSystemsConstants.STRIPE]),
  request: PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(PaymentSuccessWrapper);
