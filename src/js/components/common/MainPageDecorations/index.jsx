import pageBackgroundMobile from '@/assets/images/global/bg-mobile.png';
import pageBackgroundTablet from '@/assets/images/global/bg-tablet.png';
import pageBackground from '@/assets/images/global/bg.png';
import PageDecorations from '@/components/common/PageDecorations';

import styles from './styles.module.scss';

function MainPageDecorations() {
  return (
    <PageDecorations
      classNameImage={styles.mainPageDecorationsImage}
      classNameBg={styles.mainPageDecorationsBg}
      classNameImageBg={styles.mainPageDecorationsImage__bg}
      withRepeatBg
      pageBackgroundDesktop={pageBackground}
      pageBackgroundTablet={pageBackgroundTablet}
      pageBackgroundMobile={pageBackgroundMobile}
      quality={70}
    />
  );
}

export default MainPageDecorations;
