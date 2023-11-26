'use client';

import { useEffect, useMemo, useState } from 'react';

import DarkBackgroundOverlay from '@/js/components/global/DarkBackgroundOverlay';
import Footer from '@/js/components/global/Footer';
import Header from '@/js/components/global/Header';

import styles from './index.module.scss';

import AnimateIn from '../AnimateIn';
import Collector from '../Collectors';
import FanPovered from '../FanPovered';
import MainBanner from '../MainBanner';
import MainCards from '../MainCards';
import Preorders from '../Preorders';

const MainContent = ({ scrollY = null, isMobile }) => {
  const [scrollValue, setScrollValue] = useState(0);

  const headerProps = useMemo(
    () => ({
      transparent: false,
      withTransparent: !isMobile,
      mainLanding: true,
    }),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', () => setScrollValue(window.scrollY));
  }, []);

  const [scrollYRaw, setScrollYRaw] = useState(0);

  useEffect(() => {
    let unsubScrollY = () => {};
    if (scrollY !== null) {
      console.log('useEffect, scrollY = ', scrollY);
      const onChangeScrollY = () => setScrollYRaw(scrollY.get());

      unsubScrollY = scrollY.onChange(onChangeScrollY);
    }

    return () => {
      unsubScrollY();
    };
  }, [scrollY]);

  return (
    <div className={styles.container}>
      <Header headerProps={headerProps} fixedHeader={false} withTransition />

      <MainBanner scrollValue={isMobile ? scrollValue : scrollYRaw} />

      <AnimateIn consoleFlag>
        <MainCards />
      </AnimateIn>

      <AnimateIn>
        <FanPovered />
      </AnimateIn>

      <AnimateIn>
        <Preorders />
      </AnimateIn>

      <Collector scrollValue={isMobile ? scrollValue : scrollYRaw} />
      <Footer footerProps={{ blackFooter: true }} />

      <DarkBackgroundOverlay />
    </div>
  );
};

export default MainContent;
