import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { textForLotsOfUtil } from '@/utils/textUtils';

import SuccessPopup from '../../common/SuccessPopup';

function WantListImportSuccessPopup({
  popupId = PopupWantListIdsConstants.WantListImportSuccessPopup,
  popupData: { itemsCount = 0 } = {},
}) {
  return (
    <SuccessPopup
      popupId={popupId}
      popupData={{
        text: `<b class='c-black'>${itemsCount}</b> ${textForLotsOfUtil(itemsCount, [
          'release',
          'releases',
        ])} found. Starting import`,
      }}
    />
  );
}

export default WantListImportSuccessPopup;
