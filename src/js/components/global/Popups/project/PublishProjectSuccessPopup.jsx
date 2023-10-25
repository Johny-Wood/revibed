import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../common/SuccessPopup';

function PublishProjectSuccessPopup({ popupId = PopupProjectIdsConstants.PublishProjectSuccessPopup }) {
  return <SuccessPopup popupId={popupId} popupData={{ text: MessagesSuccessConstants.PUBLISH_PROJECT_SUCCESS }} />;
}

export default PublishProjectSuccessPopup;
