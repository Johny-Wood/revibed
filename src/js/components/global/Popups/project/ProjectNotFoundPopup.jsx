import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function ProjectNotFoundPopup({ popupId = PopupProjectIdsConstants.ProjectNotFoundPopup }) {
  return <WarningPopup popupId={popupId} popupData={{ text: MessagesErrorConstants.PROJECT_NOT_FOUND }} />;
}

export default ProjectNotFoundPopup;
