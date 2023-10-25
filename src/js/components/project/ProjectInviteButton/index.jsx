import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import InviteIcon from '@/icons/project/InviteIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function ProjectInviteButton({ color, projectId, showPopup }) {
  return (
    <ButtonIcon
      onClick={() => {
        showPopup(PopupProjectIdsConstants.ProjectInvitePopup, { projectId });
      }}
      text="Invite users"
      color={color}
      className={styles.buttonProjectInvite}
      size={ComponentsCommonConstants.Size.SMALL45}
      icon={InviteIcon}
      iconColor={color}
    />
  );
}

ProjectInviteButton.defaultProps = {
  color: '',
};

ProjectInviteButton.propTypes = {
  projectId: PropTypes.number.isRequired,
  color: PropTypes.string,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ProjectInviteButton);
