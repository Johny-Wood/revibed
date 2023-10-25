import ConfirmPhoneNumber from '@/components/ConfirmPhoneNumber';
import Popup from '@/components/primary/Popup';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';

import styles from './styles.module.scss';

function PhoneNumberPopup({ popupId = PopupPersonalIdsConstants.PhoneNumberPopup, popupData }) {
  return (
    <Popup
      popupId={popupId}
      maxWidth={425}
      textAlign="center"
      classCustom={styles.PhoneNumberPopup}
      popupInClassName={styles.popupIn}
      popupContentClassName={styles.popupContent}
    >
      <ConfirmPhoneNumber {...popupData} popupHeaderClassName={styles.popupHeader} withTitle />
    </Popup>
  );
}

export default PhoneNumberPopup;
