import { useEffect, useRef, useState } from 'react';

import { connect } from 'react-redux';

import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import LandingAIcon from '@/icons/landing/LandingAIcon';
import LandingBIcon from '@/icons/landing/LandingBIcon';
import LandingRipsRipSection from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection/_components/sections/LandingRipsRipSection';
import LandingRipsTelegramSection from '@/pages/landing/LandingWrapper/_components/sections/LandingRipsSection/_components/sections/LandingRipsTelegramSection';
import { disableScrollAction } from '@/redux-actions/components/scrollActions';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const startPoint = 40;
const endPoint = 100;
const distancePoint = endPoint - startPoint;
const endDeg = 90;
const step = endDeg / distancePoint;

function LandingRipsDesktop({ currentScrollPercent, scrollIsDisabled, disableScroll, delta, sprites: { vinyl } = {} }) {
  const scrollRef = useRef(null);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.LANDING_RIPS_SECTION,
      RoutePathsConstants.WANTLIST_TOOL,
      scrollRef
    );

    return () => {
      disableScroll({ isDisabled: false });
    };
  }, [disableScroll]);

  useEffect(() => {
    if (currentScrollPercent >= startPoint) {
      setRotate((step * currentScrollPercent - distancePoint) * -1);
    }
  }, [currentScrollPercent]);

  useEffect(() => {
    if (currentScrollPercent === 100 && !scrollIsDisabled && rotate < -90) {
      disableScroll({ isDisabled: true });
    }
  }, [currentScrollPercent, disableScroll, rotate, scrollIsDisabled]);

  useEffect(() => {
    if (currentScrollPercent === 100 && !scrollIsDisabled && rotate === -90 && delta.value > 0) {
      disableScroll({ isDisabled: true });
    }

    if (currentScrollPercent === 100 && scrollIsDisabled && rotate === -90 && delta.value < 0) {
      disableScroll({ isDisabled: false });
    }

    if (currentScrollPercent < 100 || (rotate >= -90 && delta.value < 0) || (rotate <= -270 && delta.value >= 0)) {
      return;
    }

    setRotate(rotate + (180 / 15) * (delta.value >= 0 ? -1 : 1));
  }, [currentScrollPercent, delta.time, delta.value, disableScroll, rotate, scrollIsDisabled]);

  return (
    <div className={styles.landingRipsSection}>
      <div className={styles.landingRipsSection__vinyl}>
        <div className={styles.landingRipsSection__vinyl__wrapper} style={{ transform: `rotate(${rotate}deg)` }}>
          <div
            className={styles.landingRipsSection__vinyl__img}
            style={{ backgroundImage: `url(${vinyl?.img?.currentSrc || ''})` }}
          />
          <div className={styles.landingRipsSection__title__rip}>
            <LandingAIcon />
          </div>
          <div className={styles.landingRipsSection__content__rip} ref={scrollRef}>
            <LandingRipsRipSection />
          </div>
          <div className={styles.landingRipsSection__title__telegram}>
            <LandingBIcon />
          </div>
          <div className={styles.landingRipsSection__content__telegram}>
            <LandingRipsTelegramSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    scrollIsDisabled: state.ScrollReducer.isDisabled,
  }),
  (dispatch) => ({
    disableScroll: ({ isDisabled }) => {
      dispatch(disableScrollAction({ isDisabled }));
    },
  })
)(LandingRipsDesktop);
