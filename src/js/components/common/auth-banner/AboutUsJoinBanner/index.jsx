import JoinBanner from '@/components/common/auth-banner/JoinBanner';

import BackgroundImage from './_images/background.png';
import styles from './styles.module.scss';

function AboutUsJoinBanner() {
  return (
    <JoinBanner
      BackgroundImage={BackgroundImage}
      className={styles.aboutUsJoinBanner}
      titleClassName={styles.aboutUsJoinBanner__title}
      formClassName={styles.aboutUsJoinBanner__form}
      textClassName={styles.aboutUsJoinBanner__text}
      backgroundClassName={styles.aboutUsJoinBanner__background}
      backgroundIsFill
    />
  );
}

export default AboutUsJoinBanner;
