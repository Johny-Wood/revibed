import LinkDefault from '@/components/ui/links/LinkDefault';
import AppStoreIcon from '@/icons/mobile-stores/AppStoreIcon';
import GooglePlayIcon from '@/icons/mobile-stores/GooglePlayIcon';
import OpenAccountIcon from '@/icons/OpenAccountIcon';

import styles from './styles.module.scss';

function BlackCatCardLinkButtons() {
  return (
    <div className={styles.blackCatCardLinkButtons}>
      <LinkDefault
        href="https://desktopbank.blackcatcard.com/login/registration?utm_source=collective_x&utm_medium=refferal&utm_campaign=collective_prt&utm_term=registration"
        className={styles.blackCatCardLinkButtons__openAccount}
      >
        <OpenAccountIcon />
      </LinkDefault>
      <LinkDefault href="https://bbc-get-app.onelink.me/Xl16/22e00544" className={styles.blackCatCardLinkButtons__googlePlay}>
        <GooglePlayIcon />
      </LinkDefault>
      <LinkDefault href="https://bbc-get-app.onelink.me/Xl16/22e00544" className={styles.blackCatCardLinkButtons__appStore}>
        <AppStoreIcon />
      </LinkDefault>
    </div>
  );
}

export default BlackCatCardLinkButtons;
