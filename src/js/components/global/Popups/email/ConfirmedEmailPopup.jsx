import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupEmailIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../common/SuccessPopup';

function ConfirmedEmailPopup({ popupId = PopupEmailIdsConstants.ConfirmedEmailPopup }) {
  return <SuccessPopup popupId={popupId} popupText={CommonMessagesConstants.EMAIL_CONFIRMED} />;
}

export default ConfirmedEmailPopup;
