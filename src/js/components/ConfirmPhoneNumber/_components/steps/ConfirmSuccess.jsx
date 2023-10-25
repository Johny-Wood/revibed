import { useEffect } from 'react';

import { connect } from 'react-redux';

import PopupHeader from '@/components/primary/Popup/_components/PopupHeader';
import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { closePopupAction } from '@/redux-actions/components/popupActions';

function ConfirmSuccess({ popupHeaderClassName, closePopup, confirmSuccessCallback = () => {} }) {
  useEffect(() => {
    confirmSuccessCallback();
  }, [confirmSuccessCallback]);

  return (
    <>
      <PopupHeader className={popupHeaderClassName} withClose={false}>
        Confirm your number
      </PopupHeader>
      <div className="c-green m-bottom-30">Phone number confirmed successfully</div>
      <Button
        className="w-100pct t-uppercase"
        text={CommonMessagesConstants.OK}
        onClick={() => {
          closePopup(PopupPersonalIdsConstants.PhoneNumberPopup);
        }}
      />
    </>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    closePopup: (popupId) => {
      dispatch(closePopupAction(popupId));
    },
  })
)(ConfirmSuccess);
