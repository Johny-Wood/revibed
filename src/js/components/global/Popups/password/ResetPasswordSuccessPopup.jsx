import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupPasswordIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../common/SuccessPopup';

function ResetPasswordSuccessPopup({ popupId = PopupPasswordIdsConstants.ResetPasswordSuccessPopup }) {
  return <SuccessPopup popupId={popupId} popupData={{ text: MessagesSuccessConstants.RESET_PASSWORD_SUCCESS }} />;
}

export default ResetPasswordSuccessPopup;
