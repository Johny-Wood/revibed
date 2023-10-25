import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../../common/SuccessPopup';

function EditDraftProjectSuccessPopup({ popupId = PopupProjectIdsConstants.EditDraftProjectSuccessPopup }) {
  return <SuccessPopup popupId={popupId} popupData={{ text: MessagesSuccessConstants.DRAFT_PROJECT_EDIT_SUCCESS }} />;
}

export default EditDraftProjectSuccessPopup;
