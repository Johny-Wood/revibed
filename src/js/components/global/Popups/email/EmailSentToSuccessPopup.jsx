import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../common/SuccessPopup';

function EmailSentToSuccessPopup({ popupId = PopupEmailIdsConstants.EmailSentToSuccessPopup }) {
  return <SuccessPopup popupId={popupId} popupText={MessagesSuccessConstants.EMAIL_SENT_TO_SUCCESS} />;
}

export default EmailSentToSuccessPopup;
