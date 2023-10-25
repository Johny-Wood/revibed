import { useCallback, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Preloader from '@/components/ui/Preloader';
import { PopupCommonIdsConstants, PopupTokenIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import NextRouter from '@/services/NextRouter';

function PaymentCancelWrapper({
  inProcess,
  request,
  withToken,

  showPopup,
}) {
  const getAction = useCallback(() => {
    const { router = {}, router: { router: { query: { token } = {} } = {} } = {} } = NextRouter.getInstance();

    if (token || !withToken) {
      router.push(RoutePathsConstants.TOP_UP_BALANCE);

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
      router.push(RoutePathsConstants.TOP_UP_BALANCE);
      showPopup(PopupTokenIdsConstants.NoSuchTokenPopup);
    }
  }, [inProcess, request, showPopup, withToken]);

  useEffect(() => {
    getAction();
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
