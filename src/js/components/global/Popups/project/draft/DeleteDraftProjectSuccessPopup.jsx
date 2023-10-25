import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../../common/SuccessPopup';

function DeleteDraftProjectSuccessPopup({ popupId = PopupProjectIdsConstants.DeleteDraftProjectSuccessPopup }) {
  return <SuccessPopup popupId={popupId} popupData={{ text: MessagesSuccessConstants.DELETE_PROJECT_SUCCESS }} />;
}

export default DeleteDraftProjectSuccessPopup;
