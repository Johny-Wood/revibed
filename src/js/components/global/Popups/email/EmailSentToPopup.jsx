import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../common/SuccessPopup';

function EmailSentToPopup() {
  return (
    <SuccessPopup
      popupId={PopupEmailIdsConstants.EmailSentToPopup}
      popupTitle={MessagesSuccessConstants.EMAIL_SENT_TO_TITLE}
      popupText={MessagesSuccessConstants.EMAIL_SENT_TO}
      className="w-305_max"
      maxWidth={460}
    />
  );
}

export default EmailSentToPopup;
