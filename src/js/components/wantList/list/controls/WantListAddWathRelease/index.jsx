import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import WatchIcon from '@/icons/want-list/WatchIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

function WantListAddWathRelease({
  disabled,
  idsNotActive,

  showPopup,
}) {
  return (
    <ButtonIcon
      icon={WatchIcon}
      borderColor="gray-8"
      transparent
      size={ComponentsCommonConstants.Size.SMALL35}
      disabled={disabled}
      onClick={() => {
        showPopup(PopupWantListIdsConstants.AddWantListReleaseForWatchPopup, {
          ids: idsNotActive,
        });
      }}
      tooltip={{
        hover: true,
        canShow: true,
        text: 'Add to watch',
        smallPadding: true,
      }}
    />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(WantListAddWathRelease);
