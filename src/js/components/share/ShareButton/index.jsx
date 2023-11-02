import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import ShareIcon from '@/icons/project/ShareIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function ShareButton({
  href,
  withText,
  className,

  showPopup,
}) {
  return (
    <ButtonIcon
      type="button_string"
      className={classNames([styles.buttonShare, className])}
      icon={ShareIcon}
      text={withText ? 'Share' : ''}
      onClick={() => {
        showPopup(PopupProjectIdsConstants.ProjectSharePopup, { href });
      }}
      aria-label="share pre-order"
    />
  );
}

ShareButton.defaultProps = {
  withText: true,
  href: '',
};

ShareButton.propTypes = {
  withText: PropTypes.bool,
  href: PropTypes.string,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ShareButton);
