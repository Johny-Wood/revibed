import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupTokenIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function InvalidTokenPopup({ popupId = PopupTokenIdsConstants.InvalidTokenPopup }) {
  return <WarningPopup popupId={popupId} popupData={{ text: MessagesErrorConstants.TOKEN_INVALID }} />;
}

export default InvalidTokenPopup;
