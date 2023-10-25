import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupTokenIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { unsubscribeRequestAction } from '@/redux-actions/email/unsubscribeActions';
import NextRouter from '@/services/NextRouter';
import { handleErrorUtil } from '@/utils/apiUtils';

function ShortUnsubscribeWrapper({ token, unsubscribeInProcess, unsubscribeRequest, showPopup, showMessage }) {
  const { router = {} } = NextRouter.getInstance();

  return (
    <div className="t-center w-100pct">
      <h1 className="m-bottom-55">
        <b>Are you sure you want to unsubscribe?</b>
      </h1>
      <div className="double-buttons double-buttons_center f-x-center">
        <Button text={CommonMessagesConstants.NO} transparent borderColor="gray-4" onClick={() => router.push('/')} />
        <Button
          text={CommonMessagesConstants.YES}
          transparent
          isInProcess={unsubscribeInProcess}
          disabled={unsubscribeInProcess}
          onClick={() => {
            unsubscribeRequest({ token })
              .then(() => {
                router.push('/').then(() => {
                  showMessage('InfoMessage', {
                    messageText: MessagesSuccessConstants.EMAIL_UNSUBSCRIBE,
                  });
                });
              })
              .catch(({ error = {} }) => {
                router.push('/').then(() => {
                  if (error) {
                    handleErrorUtil(error, {
                      BAD_REQUEST: () => {
                        showPopup(PopupTokenIdsConstants.InvalidTokenPopup);
                      },
                    });
                  }
                });
              });
          }}
        />
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    unsubscribeInProcess: state.UnsubscribeReducer.unsubscribeInProcess,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    unsubscribeRequest: (params) => unsubscribeRequestAction(params)(dispatch),
  })
)(ShortUnsubscribeWrapper);
