import { useEffect, useRef, useState } from 'react';

import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import LandingSectionLayout from '@/pages/landing/LandingWrapper/_components/LandingSectionLayout';
import LandingSectionText from '@/pages/landing/LandingWrapper/_components/LandingSectionText';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const scrollScaleEnd = 40;
const scrollScaleDiff = scrollScaleEnd;
const minScale = 0.4;
const maxScale = 1;
const scaleDiff = maxScale - minScale;

function LandingToolSection({ height, currentScrollPercent }) {
  const scrollRef = useRef(null);
  const [titleScale, setTitleScale] = useState(minScale);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.LANDING_TOOL_SECTION,
      RoutePathsConstants.WANTLIST_TOOL,
      scrollRef
    );
  }, []);

  useEffect(() => {
    if (currentScrollPercent < -40 || currentScrollPercent > 0) {
      return;
    }

    const newTitleScale = 1 - (1 - scrollScaleEnd / scrollScaleDiff - (currentScrollPercent / scrollScaleDiff) * scaleDiff);

    setTitleScale(Math.min(Math.max(minScale, newTitleScale), maxScale));
  }, [currentScrollPercent]);

  return (
    <LandingSectionLayout
      name={styles.landingToolSection}
      className={styles.landingToolSection__wrapper}
      title="What is<br/>the wantlist tool?"
      ref={scrollRef}
      height={height}
      titleStyle={{ transform: `scale(${titleScale})` }}
    >
      <LandingSectionText className={styles.landingToolSection_landingText}>
        Simply put, this is&nbsp;a&nbsp;tool made by&nbsp;and for vinyl lovers that don&rsquo;t want to&nbsp;pay inflated prices
        for the records they love.
        <br />
        <br />
      </LandingSectionText>
      <LandingSectionText className={styles.landingToolSection_landingText}>
        By&nbsp;using our wantlist, you can put yourself in&nbsp;the best possible position to&nbsp;grab records as&nbsp;soon
        as&nbsp;they get added to&nbsp;the discogs marketplace, and before the sharks come out to&nbsp;play.
      </LandingSectionText>
    </LandingSectionLayout>
  );
}

export default LandingToolSection;
