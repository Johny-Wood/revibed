import { useCallback, useEffect, useState } from 'react';

import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import LandingHeaderLogo from '@/pages/landing/LandingWrapper/_components/LandingHeaderLogo';
import LandingJoinButton from '@/pages/landing/LandingWrapper/_components/LandingJoinButton';
import LandingMainSection from '@/pages/landing/LandingWrapper/_components/sections/LandingMainSection';
import LandingRipsSection from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection';
import LandingToolSection from '@/pages/landing/LandingWrapper/_components/sections/LandingToolSection';

import styles from './styles.module.scss';

const DURATION = 2000;
const DURATION_DIFF = 200;

const sprites = {
  landingBg: {
    name: 'landing-bg.png',
    img: null,
  },
  vinyl: {
    name: 'vinyl.png',
    img: null,
    forMobile: false,
  },
};

const metaTitle = 'A Wantlist Tool For Records Wanted';

function LandingWrapper({ userIsAuthorized }) {
  const { height, isNotDesktop } = ViewportHook();
  const [currentScrollPercent, setCurrentScrollPercent] = useState(0);
  const [currentScrollTop, setCurrentScrollTop] = useState(0);
  const [delta, setDelta] = useState({ time: 0, value: 0 });
  const [readyStep1, setReadyStep1] = useState(false);
  const [readyStep2, setReadyStep2] = useState(false);
  const [readyStep3, setReadyStep3] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [ready, setReady] = useState(false);

  const preloadSprites = useCallback(
    () =>
      Object.keys(sprites).map((key) => {
        const { forMobile = true, forDesktop = true } = sprites[key];

        if ((isNotDesktop && !forMobile) || (!isNotDesktop && !forDesktop)) {
          return new Promise((resolve) => {
            resolve();
          });
        }

        const { name } = sprites[key];

        const img = new Image();
        img.src = `/media/landing/${name}`;

        return new Promise((resolve) => {
          sprites[key].img = img;

          img.addEventListener('load', resolve);
        });
      }),
    [isNotDesktop]
  );

  const preload = useCallback(async () => {
    if (ready !== false) {
      return;
    }

    await Promise.all(preloadSprites());
  }, [preloadSprites, ready]);

  const setReadyCallback = useCallback(() => {
    setReady(true);

    setTimeout(() => {
      setReadyStep1(true);
    }, DURATION_DIFF);
    setTimeout(
      () => {
        setReadyStep2(true);
      },
      (!userIsAuthorized ? DURATION : 0) + DURATION_DIFF
    );
    setTimeout(
      () => {
        setReadyStep3(true);
      },
      DURATION * (!userIsAuthorized ? 2 : 1) - DURATION_DIFF
    );
  }, [userIsAuthorized]);

  useEffect(() => {
    preload().then(() => {
      setReadyCallback();
    });
  }, [isNotDesktop, preload, ready, setReadyCallback]);

  const isBlackHeader = currentScrollPercent >= 48.5 && isNotDesktop;

  const { landingBg } = sprites;

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      preloadInProcess={!ready}
      pageName={styles.landingPage}
      withoutHeader
      withoutFooter
      hideScrollbar
      disableScrollbar={!readyStep3}
      onScrollHandler={({ scrollTop, clientHeight, contentScrollHeight }) => {
        if (!readyStep1) {
          return;
        }

        setFixed(currentScrollTop >= height * 0.8);

        setCurrentScrollTop(scrollTop);
        setCurrentScrollPercent(
          (Math.ceil(scrollTop - (height + 140)) / (contentScrollHeight - clientHeight - (height + 140))) * 100
        );
      }}
      onWheelHandler={({ deltaY, detail, wheelDelta }) => {
        if (currentScrollPercent < 100 || isNotDesktop) {
          return;
        }
        setDelta({ time: new Date().valueOf(), value: deltaY || detail || wheelDelta });
      }}
    >
      <div className={styles.landing}>
        {!!landingBg?.img?.currentSrc && (
          <div className={styles.landing__bg} style={{ backgroundImage: `url(${landingBg?.img?.currentSrc})` }} />
        )}
        <TransitionSwitchLayout isShown={readyStep3} duration={DURATION}>
          <LandingHeaderLogo color={isBlackHeader ? '#000000' : '#f2f2f2'} />
        </TransitionSwitchLayout>
        <LandingMainSection
          currentScrollPercent={currentScrollPercent}
          height={height}
          readyStep1={readyStep1}
          readyStep2={readyStep2}
          readyStep3={readyStep3}
          duration={DURATION}
          scrollTop={currentScrollTop}
        />
        <LandingToolSection currentScrollPercent={currentScrollPercent} height={height} />
        <LandingRipsSection height={height} currentScrollPercent={currentScrollPercent} delta={delta} sprites={sprites} />
        <TransitionSwitchLayout isShown={fixed} duration={DURATION / 2}>
          <LandingJoinButton fixed />
        </TransitionSwitchLayout>
      </div>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(LandingWrapper);
