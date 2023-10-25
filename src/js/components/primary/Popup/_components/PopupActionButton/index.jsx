import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';

const PopupActionButton = ({
  popupId,
  closePopup,
  closeCallBack,
  okButtonOnClick,
  okButtonText,
  okButtonInProcess,
  okButtonDisables,
  okButtonBorderColor = 'black',
  className,
}) => (
  <Button
    transparent
    borderColor={okButtonBorderColor}
    text={okButtonText}
    isInProcess={okButtonInProcess}
    disabled={okButtonDisables || okButtonInProcess}
    onClick={() => {
      if (closeCallBack) {
        closeCallBack();
      }

      if (okButtonOnClick) {
        okButtonOnClick().then(() => {
          closePopup(popupId);
        });
      } else {
        closePopup(popupId);
      }
    }}
    className={classNames(className)}
  />
);

export default PopupActionButton;
