import classNames from 'classnames';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import TrashIcon from '@/icons/want-list/TrashIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

function WantListRemoveRelease({
  disabled,

  releaseIds,
  count,
  releases,
  activeReleasesCount,
  name,
  buttonSize = ComponentsCommonConstants.Size.SMALL35,

  callback = () => {},

  showPopup,
  className,
}) {
  return (
    <ButtonIcon
      icon={TrashIcon}
      borderColor="gray-8"
      transparent
      className={classNames(className)}
      size={buttonSize}
      disabled={disabled}
      onClick={() => {
        showPopup(PopupWantListIdsConstants.RemoveWantListReleasePopup, {
          releaseIds,
          count,
          name,
          releases,
          activeReleasesCount,
          callback,
        });
      }}
      tooltip={{
        hover: true,
        canShow: true,
        text: 'Remove release',
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
)(WantListRemoveRelease);
