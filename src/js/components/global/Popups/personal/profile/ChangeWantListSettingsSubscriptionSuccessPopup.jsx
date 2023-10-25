import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';

import SuccessPopup from '../../common/SuccessPopup';

function ChangeWantListSettingsSubscriptionSuccessPopup({
  popupId = PopupPersonalIdsConstants.ChangeWantListSettingsSubscriptionSuccessPopup,
}) {
  return (
    <SuccessPopup
      popupId={popupId}
      popupData={{
        text: MessagesSuccessConstants.CHANGE_WANT_LIST_SETTINGS_SUBSCRIPTION_SUCCESS,
      }}
    />
  );
}

export default ChangeWantListSettingsSubscriptionSuccessPopup;
