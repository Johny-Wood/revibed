import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function EmailAlreadyConfirmedPopup({ popupId = PopupEmailIdsConstants.EmailAlreadyConfirmedPopup }) {
  return <WarningPopup popupId={popupId} popupText={MessagesErrorConstants.EMAIL_ALREADY_CONFIRMED} />;
}

export default EmailAlreadyConfirmedPopup;
