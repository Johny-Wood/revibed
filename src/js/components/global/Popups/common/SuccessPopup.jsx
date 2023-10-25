import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupOkButton from '@/components/primary/Popup/_components/PopupOkButton';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupCommonIdsConstants } from '@/constants/popups/id';
import { closePopupAction } from '@/redux-actions/components/popupActions';

function SuccessPopup({
  popupId = PopupCommonIdsConstants.SuccessPopup,
  popupData: { text, title, closeCallBack } = {},
  closePopup,
  popupTitle,
  popupText,
  popupCloseCallBack,
  className,

  maxWidth,

  children,
}) {
  return (
    <Popup
      popupId={popupId}
      headerText={title || popupTitle}
      closeCallBack={closeCallBack || popupCloseCallBack}
      maxWidth={maxWidth}
    >
      {(!!text || !!popupText) && <PopupTextContent className={className}>{parse(text || popupText)}</PopupTextContent>}
      {children}
      <PopupOkButton
        popupId={popupId}
        closePopup={closePopup}
        closeCallBack={closeCallBack}
        popupCloseCallBack={popupCloseCallBack}
      />
    </Popup>
  );
}

SuccessPopup.defaultProps = {
  popupTitle: `${CommonMessagesConstants.SUCCESS}!`,
  popupText: null,
  popupCloseCallBack: () => {},
};

SuccessPopup.propTypes = {
  popupTitle: PropTypes.string,
  popupText: PropTypes.string,
  popupCloseCallBack: PropTypes.func,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    closePopup: (popupId) => {
      dispatch(closePopupAction(popupId));
    },
  })
)(SuccessPopup);
