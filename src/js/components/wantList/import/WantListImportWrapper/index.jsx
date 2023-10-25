import { useState } from 'react';

import { connect } from 'react-redux';

import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { importWantListRequestAction } from '@/redux-actions/wantList/wantListActions';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import { handleErrorUtil } from '@/utils/apiUtils';
import { appendFormUtil } from '@/utils/form/formUtils';

function Wrapper({
  component: Component,
  componentProps = {},

  userIsAuthorized,

  importWantListInProcess,
  importWantListRequest,
  callbackImport = () => {},

  showPopup,
  showMessage,
}) {
  const [activeStep, setActiveStep] = useState(false);

  const navigateToSignInOrExecute = ({ notExecutableFunction = () => {}, executableFunction = () => {} }) => {
    if (!userIsAuthorized) {
      AuthRedirectorService.setAuthRedirector();

      notExecutableFunction();

      return;
    }

    executableFunction();
  };

  const showErrorMessage = (messageText) => {
    showMessage('ErrorMessage', { messageText });
  };

  const importWantList = (formField = {}, params) => {
    if (importWantListInProcess) {
      return;
    }

    const formData = appendFormUtil({ fieldsForm: [formField] });

    setActiveStep(true);

    importWantListRequest(formData, params)
      .then(({ itemsCount }) => {
        showPopup(PopupWantListIdsConstants.WantListImportSuccessPopup, {
          itemsCount,
        });

        setActiveStep(false);
        callbackImport();
      })
      .catch(({ error }) => {
        setActiveStep(false);
        callbackImport();

        if (error) {
          handleErrorUtil(error, {
            DISCOGS_ACCOUNT_NOT_CONNECTED: () => {
              showErrorMessage(MessagesErrorConstants.DISCOGS_ACCOUNT_NOT_CONNECTED);
            },
            WANT_LIST_ALREADY_IN_PROCESS: () => {
              showErrorMessage(MessagesErrorConstants.WANT_LIST_ALREADY_IN_PROCESS);
            },
            WANT_ITEMS_EMPTY: () => {
              showErrorMessage(MessagesErrorConstants.WANT_ITEMS_EMPTY);
            },
          });
        }
      });
  };

  return (
    <Component
      navigateToSignInOrExecute={navigateToSignInOrExecute}
      callbackImportWantList={importWantList}
      inProcess={importWantListInProcess && activeStep}
      {...componentProps}
    />
  );
}

const WantListImportWrapper = connect(
  (state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    importWantListInProcess: state.WantListReducer.importWantListInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    importWantListRequest: (formData, params) => importWantListRequestAction(formData, params)(dispatch),
  })
)(Wrapper);

export default WantListImportWrapper;
