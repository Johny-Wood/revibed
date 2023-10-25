import { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CloseIcon from '@/icons/control/close/CloseIcon';
import { closePopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

class ClosePopupButton extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.keyupEventListener, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyupEventListener, false);
  }

  keyupEventListener = ({ keyCode }) => {
    if (keyCode === 27) {
      this.closePopupMethod();
    }
  };

  closePopupMethod = () => {
    const { closePopup, closeCallBack, popupKey } = this.props;

    closePopup(popupKey);
    closeCallBack();
  };

  render() {
    return (
      <div className={styles.popupClose} onClick={this.closePopupMethod}>
        <CloseIcon />
      </div>
    );
  }
}

ClosePopupButton.defaultProps = {
  closeCallBack: () => {},
};

ClosePopupButton.propTypes = {
  popupKey: PropTypes.string.isRequired,
  closeCallBack: PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    closePopup: (popupId) => {
      dispatch(closePopupAction(popupId));
    },
  })
)(ClosePopupButton);
