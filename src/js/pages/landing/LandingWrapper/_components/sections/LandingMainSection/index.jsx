import { useEffect, useRef, useState } from 'react';

import ScrollDownButton from '@/components/common-ui/buttons/ScrollDownButton';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Logo from '@/components/primary/Logo';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import LandingJoinButton from '@/pages/landing/LandingWrapper/_components/LandingJoinButton';
import LandingSectionLayout from '@/pages/landing/LandingWrapper/_components/LandingSectionLayout';

import styles from './styles.module.scss';

const scrollOpacityEnd = 25;
const minOpacity = 0;
const maxOpacity = 1;

const scrollScaleEnd = 25;
const scrollScaleDiff = scrollScaleEnd - 5;
const minScale = 0.5;
const maxScale = 1;
const scaleDiff = maxScale - minScale;

const scrollTranslateYEnd = 36;
const minTranslateY = 0;
const maxTranslateY = 160;
const translateYDiff = maxTranslateY - minTranslateY;

function LandingMainSection({ currentScrollPercent, height, readyStep1, readyStep2, readyStep3, duration, scrollTop }) {
  const { isNotDesktop } = ViewportHook();
  const scrollTranslateYDiff = (!isNotDesktop ? 66 : 56) - scrollTranslateYEnd;
  const controlRef = useRef(null);
  const [bottomOpacity, setBottomOpacity] = useState(maxOpacity);
  const [bottomScale, setBottomScale] = useState(maxScale);
  const [bottomTranslateY, setBottomTranslateY] = useState(minTranslateY);

  useEffect(() => {
    if (currentScrollPercent >= 0) {
      return;
    }

    const newBottomOpacity = currentScrollPercent / -scrollOpacityEnd;
    const newBottomScale =
      (maxScale - (scrollScaleEnd / scrollScaleDiff - (currentScrollPercent / scrollScaleDiff) * scaleDiff)) * -1;
    const newBottomTranslateY =
      (currentScrollPercent / scrollTranslateYDiff + scrollTranslateYEnd / scrollTranslateYDiff) * translateYDiff + maxTranslateY;

    setBottomOpacity(Math.min(Math.max(minOpacity, newBottomOpacity), maxOpacity));
    setBottomScale(Math.min(Math.max(minScale, newBottomScale), maxScale));
    setBottomTranslateY(Math.min(Math.max(minTranslateY, newBottomTranslateY), maxTranslateY));
  }, [currentScrollPercent, scrollTranslateYDiff]);

  return (
    <LandingSectionLayout name={styles.landingMainSection} className={styles.landingMainSection__wrapper} height={height}>
      <TransitionSwitchLayout isShown={readyStep2} name="fade-to-top" duration={duration}>
        <div className={styles.landingMainSection__info}>
          <div className="logo">
            <Logo color="white" />
          </div>
          <div className={styles.landingMainSection__intro}>Wantlist tool</div>
          <div className={styles.landingMainSection__text}>
            <p>A&nbsp;tool for dedicated discogs diggers.</p>
            <p>Never miss out on&nbsp;or&nbsp;overpay for records again.</p>
          </div>
        </div>
      </TransitionSwitchLayout>
      <TransitionSwitchLayout isShown={readyStep1} name="fade-to-top" duration={duration}>
        <div className={styles.landingMainSection__scrollControl}>
          <div
            className={styles.landingMainSection__scrollControl__wrapper}
            ref={controlRef}
            style={{
              opacity: bottomOpacity,
              transform: `scale(${bottomScale}) translateY(calc(1vh * ${bottomTranslateY} / ${isNotDesktop ? 8.288425 : 9.8}))`,
            }}
          >
            <LandingJoinButton duration={duration} />
            <ScrollDownButton
              sectionId={ScrollBlockIdConstants.LANDING_TOOL_SECTION}
              isShown={readyStep3}
              duration={duration}
              withAnimationDown={scrollTop <= 20}
            />
          </div>
        </div>
      </TransitionSwitchLayout>
    </LandingSectionLayout>
  );
}

export default LandingMainSection;
