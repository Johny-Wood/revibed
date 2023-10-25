import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import { PopupEmailIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { sendEmailForConfirmRequestAction } from '@/redux-actions/email/confirmEmailActions';

function SendEmailForConfirmButton({
  text = 'click here',

  email,

  sendEmailForConfirmInProcess,
  sendEmailForConfirmRequest,

  showPopup,
}) {
  return (
    <Button
      text={text}
      type="link"
      className="c-blue"
      onClick={() => {
        if (sendEmailForConfirmInProcess || !email) {
          return;
        }

        sendEmailForConfirmRequest({ email }).then(() => {
          showPopup(PopupEmailIdsConstants.EmailSentToSuccessPopup);
        });
      }}
    />
  );
}

export default connect(
  (state) => ({
    sendEmailForConfirmInProcess: state.ConfirmEmailReducer.sendEmailForConfirmInProcess,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    sendEmailForConfirmRequest: (params) => sendEmailForConfirmRequestAction(params)(dispatch),
  })
)(SendEmailForConfirmButton);
