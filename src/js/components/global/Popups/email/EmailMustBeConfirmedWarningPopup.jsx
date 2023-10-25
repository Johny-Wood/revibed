import SendEmailForConfirmButton from '@/components/common-ui/buttons/SendEmailForConfirmButton';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function EmailMustBeConfirmedWarningPopup({
  popupId = PopupEmailIdsConstants.EmailMustBeConfirmedWarningPopup,
  popupData: { email } = {},
}) {
  return (
    <WarningPopup popupId={popupId} popupTitle={MessagesErrorConstants.EMAIL_ALREADY_EXISTS_TITLE} maxWidth={500}>
      <PopupTextContent>
        {MessagesErrorConstants.EMAIL_MUST_BE_CONFIRMED}
        <SendEmailForConfirmButton email={email} />.
      </PopupTextContent>
    </WarningPopup>
  );
}

export default EmailMustBeConfirmedWarningPopup;
