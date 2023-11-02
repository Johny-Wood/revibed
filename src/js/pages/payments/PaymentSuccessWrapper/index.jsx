import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Preloader from '@/components/ui/Preloader';
import { MessagesIdConstants } from '@/constants/messages/ids';
import { PaymentSystemsConstants } from '@/constants/payment/system';
import { PopupPaymentsIdsConstants, PopupTokenIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { handleErrorUtil } from '@/utils/apiUtils';

function PaymentSuccessWrapper({
  inProcess,
  withToken,
  withRequest,
  system,
  request,

  showPopup,
  showMessage,
}) {
  const called = useRef(false);

  const router = useRouter();

  const { query: { token, paymentId, PayerID } = {} } = router;

  const paymentSuccess = useCallback(() => {
    router.push(RoutePathsConstants.BALANCE).then(() => {
      showMessage(MessagesIdConstants.PaymentSuccessMessage);
    });
  }, [router, showMessage]);

  const getAction = useCallback(() => {
    called.current = true;

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
            paymentSuccess();
          })
          .catch(({ error = {}, payload: { redirectUrl } = {} }) => {
            if (error) {
              handleErrorUtil(error, {
                PAYMENT_HELD: () => {
                  router.push(RoutePathsConstants.TOP_UP_BALANCE).then(() => {
                    showMessage(PopupPaymentsIdsConstants.PayPalPaymentHeldMessage);
                  });
                },
                PAYMENT_ACTION_REQUIRED: () => {
                  router.push(redirectUrl || RoutePathsConstants.TOP_UP_BALANCE).then();
                },
              });
            } else {
              router.push(RoutePathsConstants.TOP_UP_BALANCE).then();
            }
          });
      } else {
        paymentSuccess();
      }
    } else {
      router.push(RoutePathsConstants.TOP_UP_BALANCE).then(() => {
        showPopup(PopupTokenIdsConstants.NoSuchTokenPopup);
      });
    }
  }, [
    PayerID,
    inProcess,
    paymentId,
    paymentSuccess,
    request,
    router,
    showMessage,
    showPopup,
    system,
    token,
    withRequest,
    withToken,
  ]);

  useEffect(() => {
    if (!called.current) {
      getAction();
    }
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
