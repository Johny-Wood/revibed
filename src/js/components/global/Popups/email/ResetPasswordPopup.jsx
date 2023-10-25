import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../common/SuccessPopup';

function ResetPasswordPopup() {
  return (
    <SuccessPopup
      popupId={PopupEmailIdsConstants.ResetPasswordPopup}
      popupTitle={MessagesSuccessConstants.RESET_PASSWORD_TITLE}
      popupText={MessagesSuccessConstants.RESET_PASSWORD}
      maxWidth={400}
    />
  );
}

export default ResetPasswordPopup;
