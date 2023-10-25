import { connect } from 'react-redux';

import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import PhotoIcon from '@/icons/PhotoIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function UserChangeAvatar({
  image,
  callBackCrop = () => {},

  showPopup,
}) {
  return (
    <div
      className={styles.userChangeAvatar}
      style={{ backgroundImage: `url(${image || ''})` }}
      onClick={() => {
        showPopup(PopupPersonalIdsConstants.ChangeAvatarPopup, {
          callBackCrop,
        });
      }}
    >
      {!image && <div className={styles.userChangeAvatar__label}>upload&nbsp;photo</div>}
      <PhotoIcon />
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(UserChangeAvatar);
