import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Preloader from '@/components/ui/Preloader';
import { PopupCommonIdsConstants, PopupTokenIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showPopupAction } from '@/redux-actions/components/popupActions';

function PaymentCancelWrapper({
  inProcess,
  request,
  withToken,

  showPopup,
}) {
  const called = useRef(false);

  const router = useRouter();

  const { query: { token } = {} } = router;

  const getAction = useCallback(() => {
    called.current = true;

    if (token || !withToken) {
      router.push(RoutePathsConstants.TOP_UP_BALANCE).then();

      if (inProcess) {
        return;
      }

      request({
        token,
      })
        .then()
        .catch(() => {
          showPopup(PopupCommonIdsConstants.DefaultWarningPopup);
        });
    } else {
      router.push(RoutePathsConstants.TOP_UP_BALANCE).then(() => {
        showPopup(PopupTokenIdsConstants.NoSuchTokenPopup);
      });
    }
  }, [inProcess, request, router, showPopup, token, withToken]);

  useEffect(() => {
    if (!called.current) {
      getAction();
    }
  }, [getAction]);

  return <Preloader id="payment-cancel" withOffsets={false} isShown color="gray" opacity={1} />;
}

PaymentCancelWrapper.defaultProps = {
  inProcess: false,
  withToken: true,
  request: () => {},
};

PaymentCancelWrapper.propTypes = {
  inProcess: PropTypes.bool,
  withToken: PropTypes.bool,
  request: PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(PaymentCancelWrapper);
