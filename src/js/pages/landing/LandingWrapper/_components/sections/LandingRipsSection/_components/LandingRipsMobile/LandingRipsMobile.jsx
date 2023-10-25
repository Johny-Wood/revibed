import { useEffect, useRef, useState } from 'react';

import ScrollDownButton from '@/components/common-ui/buttons/ScrollDownButton';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import LandingRipsRipSection from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection/_components/sections/LandingRipsRipSection';
import LandingRipsTelegramSection from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection/_components/sections/LandingRipsTelegramSection';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const scrollScaleEnd = 60;
const scrollScaleDiff = 20;
const minArrowOpacity = 0;
const maxArrowOpacity = 1;
const scaleDiff = maxArrowOpacity - minArrowOpacity;

function LandingRipsMobile({ currentScrollPercent }) {
  const [arrowOpacity, setArrowOpacity] = useState(1);
  const scrollRef = useRef(null);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.LANDING_RIP_STEP_2,
      RoutePathsConstants.WANTLIST_TOOL,
      scrollRef
    );
  }, []);

  useEffect(() => {
    const newArrowOpacity =
      maxArrowOpacity + (scrollScaleEnd / scrollScaleDiff - (currentScrollPercent / scrollScaleDiff) * scaleDiff);

    setArrowOpacity(Math.min(Math.max(minArrowOpacity, newArrowOpacity), maxArrowOpacity));
  }, [currentScrollPercent]);

  return (
    <div className={styles.landingRipsSectionMobile}>
      <div className={styles.landingRipsSectionMobile__step}>
        <h2 className={styles.landingRipsSectionMobile__title}>How it Works</h2>
        <LandingRipsRipSection />
      </div>
      <ScrollDownButton
        className={styles.landingRipsSectionMobile__buttonScrollDownContainer}
        isShown
        scrollBar={CommonScrollbarLocationsConstants.MAIN_SCROLL}
        sectionId={ScrollBlockIdConstants.LANDING_RIP_STEP_2}
        iconColor="black"
        style={{ opacity: arrowOpacity }}
      />
      <div className={styles.landingRipsSectionMobile__step} ref={scrollRef}>
        <h2 className={styles.landingRipsSectionMobile__title}>
          Track the
          <br />
          Records
        </h2>
        <LandingRipsTelegramSection />
      </div>
    </div>
  );
}

export default LandingRipsMobile;
