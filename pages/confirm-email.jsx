import { useEffect } from 'react';

import { connect } from 'react-redux';

import popupAnimation from '@/assets/styles/animations/popup.module.scss';
import { PopupEmailIdsConstants, PopupPersonalIdsConstants, PopupTokenIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ConfirmEmailWrapper from '@/pages/confirm/ConfirmEmailWrapper';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { confirmEmailRequestAction } from '@/redux-actions/email/confirmEmailActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';

function ConfirmEmailPage({ variablesList: { GOLDEN_COIN_PROMOTION_ENABLED } = {}, showPopup, confirmEmailRequest }) {
  const { isNotDesktop, isTablet } = ViewportHook();

  useEffect(() => {
    const { router = {}, router: { router: { query: { token } = {} } = {} } = {} } = NextRouter.getInstance();

    if (token) {
      confirmEmailRequest({ token })
        .then(() => {
          router.push(RoutePathsConstants.MAIN).then(() => {
            showPopup(PopupPersonalIdsConstants.FavoriteStylesPopup, {
              animationClassNames:
                isNotDesktop && !isTablet
                  ? {
                      enter: popupAnimation.onlyPopupAnimationEnter,
                      enterActive: popupAnimation.onlyPopupAnimationEnter_active,
                      exit: popupAnimation.onlyPopupAnimationExit,
                      exitActive: popupAnimation.onlyPopupAnimationExit_active,
                    }
                  : undefined,
            });
          });
        })
        .catch(({ error = {} }) => {
          if (error) {
            handleErrorUtil(error, {
              EMAIL_CONFIRM_TOKEN_INVALID: () => {
                router.push(RoutePathsConstants.MAIN).then(() => {
                  showPopup(PopupTokenIdsConstants.InvalidTokenPopup);
                });
              },
              EMAIL_ALREADY_CONFIRMED: () => {
                router.push(RoutePathsConstants.MAIN).then(() => {
                  showPopup(PopupEmailIdsConstants.EmailAlreadyConfirmedPopup);
                });
              },
            });
          }
        });
    } else {
      router.push(RoutePathsConstants.MAIN).then(() => {
        showPopup(PopupTokenIdsConstants.NoSuchTokenPopup);
      });
    }
  }, [GOLDEN_COIN_PROMOTION_ENABLED, confirmEmailRequest, isNotDesktop, isTablet, showPopup]);

  return <ConfirmEmailWrapper />;
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    confirmEmailRequest: (params) => confirmEmailRequestAction(params)(dispatch),
  })
)(ConfirmEmailPage);
