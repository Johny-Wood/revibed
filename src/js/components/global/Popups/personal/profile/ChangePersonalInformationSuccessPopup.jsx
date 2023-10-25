import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../../common/SuccessPopup';

function ChangePersonalInformationSuccessPopup({ popupId = PopupPersonalIdsConstants.ChangePersonalInformationSuccessPopup }) {
  return <SuccessPopup popupId={popupId} popupData={{ text: MessagesSuccessConstants.CHANGE_PERSONAL_INFORMATION_SUCCESS }} />;
}

export default ChangePersonalInformationSuccessPopup;
