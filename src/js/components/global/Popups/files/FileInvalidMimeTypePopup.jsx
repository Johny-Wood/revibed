import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { PopupFileConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function FileInvalidMimeTypePopup({ popupData: { accept } = {}, popupId = PopupFileConstants.FileInvalidMimeTypePopup }) {
  return <WarningPopup popupId={popupId} popupData={{ text: `${CommonErrorMessages.FILE_TYPE} ${accept}` }} />;
}

export default FileInvalidMimeTypePopup;
