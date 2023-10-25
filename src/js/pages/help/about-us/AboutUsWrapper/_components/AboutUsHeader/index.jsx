import { useEffect } from 'react';

import classNames from 'classnames';

import ScrollDownButton from '@/components/common-ui/buttons/ScrollDownButton';
import MainPageDecorations from '@/components/common/MainPageDecorations';
import { CommonHeadConstants } from '@/constants/common/head';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

function AboutUsHeader({ scrollRef, isTopOffsetMinus }) {
  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.ABOUT_US,
      RoutePathsConstants.ABOUT_US,
      scrollRef
    );
  }, [scrollRef]);

  return (
    <div className={classNames(styles.aboutUsHeader, isTopOffsetMinus && styles.aboutUsHeader_top_minus)}>
      <MainPageDecorations />
      <div className={styles.aboutUsHeader__content}>
        <div className={styles.aboutUsHeader__info}>
          <h1 className={styles.aboutUsHeader__title}>
            Discover records and preserve{' '}
            <span className={styles.aboutUsHeader__title_gradient}>the musics of&nbsp;the world</span>
          </h1>
          <div className={styles.aboutUsHeader__text}>
            Unearthing and documenting musics of&nbsp;the world. {CommonHeadConstants.SITE_NAME}
            &nbsp;is the best place for music lovers to&nbsp;discover rare records before they vanish.
          </div>
        </div>
        <ScrollDownButton
          withAnimationDown
          className={styles.scrollDownButton}
          isShown
          sectionId={ScrollBlockIdConstants.ABOUT_US}
          secondOffset={-10}
        />
      </div>
    </div>
  );
}

export default AboutUsHeader;
