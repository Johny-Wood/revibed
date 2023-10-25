import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupTokenIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function NoSuchTokenPopup({ popupId = PopupTokenIdsConstants.NoSuchTokenPopup }) {
  return <WarningPopup popupId={popupId} popupData={{ text: MessagesErrorConstants.NO_SUCH_TOKEN }} />;
}

export default NoSuchTokenPopup;
