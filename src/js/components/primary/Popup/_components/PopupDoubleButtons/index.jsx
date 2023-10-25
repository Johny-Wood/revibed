import classNames from 'classnames';

import PopupActionButton from '@/components/primary/Popup/_components/PopupActionButton';
import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';

import styles from './styles.module.scss';

function PopupDoubleButtons({ popupId, closePopup, className, ...props }) {
  return (
    <div className={classNames(styles.popupDoubleButtons, className)}>
      <Button
        transparent
        borderColor="gray-4"
        text={CommonMessagesConstants.CANCEL}
        onClick={() => {
          closePopup(popupId);
        }}
      />
      <PopupActionButton popupId={popupId} closePopup={closePopup} {...props} />
    </div>
  );
}

export default PopupDoubleButtons;
