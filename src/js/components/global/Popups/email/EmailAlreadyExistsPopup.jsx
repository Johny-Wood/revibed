import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function EmailAlreadyExistsPopup() {
  return (
    <WarningPopup
      popupId={PopupEmailIdsConstants.EmailAlreadyExistsPopup}
      popupTitle={MessagesErrorConstants.EMAIL_ALREADY_EXISTS_TITLE}
      popupText={MessagesErrorConstants.EMAIL_ALREADY_EXISTS}
      maxWidth={500}
    />
  );
}

export default EmailAlreadyExistsPopup;
