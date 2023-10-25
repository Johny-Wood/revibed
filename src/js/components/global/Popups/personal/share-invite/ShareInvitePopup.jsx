import Popup from '@/components/primary/Popup';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import ShareLinks from '@/components/share/ShareLinks';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';

import styles from './styles.module.scss';

function ShareInvitePopup({ popupId = PopupPersonalIdsConstants.ShareInvitePopup, popupData: { href, withCopyLink } = {} }) {
  return (
    <Popup popupId={popupId} classCustom={styles.ShareInvitePopup} headerText="Send invite" maxWidth={445} textAlign="center">
      <PopupTextContent>
        Choose the way for invite sending
        <ShareLinks
          className={styles.shareLinks}
          linkClassName={styles.shareLinks__link}
          href={href}
          withCopyLink={withCopyLink}
        />
      </PopupTextContent>
    </Popup>
  );
}

export default ShareInvitePopup;
