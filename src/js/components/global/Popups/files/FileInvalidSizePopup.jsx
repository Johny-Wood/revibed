import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { PopupFileConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function FileInvalidSizePopup({
  popupData: { fileMinSize = 0, fileMaxSize = 0 } = {},
  popupId = PopupFileConstants.FileInvalidSizePopup,
}) {
  return (
    <WarningPopup popupId={popupId} popupData={{ text: `${CommonErrorMessages.FILE_SIZE} ${fileMinSize}-${fileMaxSize}Mb` }} />
  );
}

export default FileInvalidSizePopup;
