import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import DeleteIcon from '@/icons/want-list/DeleteIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

function WantListRemoveWatchRelease({
  disabled,
  idsActive,

  showPopup,
}) {
  return (
    <ButtonIcon
      icon={DeleteIcon}
      borderColor="gray-8"
      transparent
      size={ComponentsCommonConstants.Size.SMALL35}
      disabled={disabled}
      onClick={() => {
        showPopup(PopupWantListIdsConstants.RemoveWantListReleaseForWatchPopup, {
          ids: idsActive,
        });
      }}
      tooltip={{
        hover: true,
        canShow: true,
        text: 'Remove from watch',
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
)(WantListRemoveWatchRelease);
