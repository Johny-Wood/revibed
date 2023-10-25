import { useCallback } from 'react';

import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';

import styles from './styles.module.scss';

function PopupOkButton({ popupId, closePopup, closeCallBack, popupCloseCallBack, button: PopupOkBtn }) {
  const onClick = useCallback(() => {
    closePopup(popupId);
    if (closeCallBack) {
      closeCallBack();
    }
    if (popupCloseCallBack) {
      popupCloseCallBack();
    }
  }, [popupId, closePopup, closeCallBack, popupCloseCallBack]);

  return (
    <div className={styles.popupOkButton}>
      {PopupOkBtn ? (
        <PopupOkBtn className="primary" transparent={false} onClick={onClick}>
          <Button className="t-uppercase" text={CommonMessagesConstants.OK} onClick={onClick} />
        </PopupOkBtn>
      ) : (
        <Button className="t-uppercase" text={CommonMessagesConstants.OK} onClick={onClick} />
      )}
    </div>
  );
}

export default PopupOkButton;
