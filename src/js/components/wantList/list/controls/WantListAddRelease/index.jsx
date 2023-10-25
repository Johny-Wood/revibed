import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import AddIcon from '@/icons/want-list/AddIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

function WantListAddRelease({ showPopup }) {
  return (
    <ButtonIcon
      icon={AddIcon}
      borderColor="gray-8"
      transparent
      className="button_add-release"
      size={ComponentsCommonConstants.Size.SMALL35}
      onClick={() => {
        showPopup(PopupWantListIdsConstants.AddWantListReleasePopup);
      }}
      tooltip={{
        hover: true,
        canShow: true,
        text: 'Add releases',
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
)(WantListAddRelease);
