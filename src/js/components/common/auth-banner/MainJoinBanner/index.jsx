import JoinBanner from '@/components/common/auth-banner/JoinBanner';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import BackgroundImageMobile from './_images/background-mobile.png';
import BackgroundImage from './_images/background.png';
import styles from './styles.module.scss';

function MainJoinBanner() {
  const { isNotDesktop } = ViewportHook();

  return (
    <JoinBanner
      BackgroundImage={isNotDesktop ? BackgroundImageMobile : BackgroundImage}
      className={styles.mainJoinBanner}
      titleClassName={styles.mainJoinBanner__title}
      formClassName={styles.mainJoinBanner__form}
      successTitleClassName={styles.mainJoinBanner__successTitle}
      contentClassName={styles.mainJoinBanner__content}
      backgroundClassName={styles.mainJoinBanner__background}
      formSuccessClassName={styles.mainJoinBanner__form_success}
      size={{
        width: 1225,
        height: 115,
      }}
    />
  );
}

export default MainJoinBanner;
