import { PopupCommonIdsConstants } from '@/constants/popups/id';

import WarningPopup from './WarningPopup';

function DefaultWarningPopup({ popupId = PopupCommonIdsConstants.DefaultWarningPopup }) {
  return <WarningPopup popupId={popupId} popupData={{ text: 'An error has occurred. Try later.' }} />;
}

export default DefaultWarningPopup;
