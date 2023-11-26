import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { ScrollerMotion, useScrollerMotion } from 'scroller-motion';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import ViewportHook from '@/js/hooks/viewport/ViewportHook';

import MainContent from './_components/MainContent';

const metaTitle = 'Wanted Vinyl Records, CDs & Cassette Tapes In High Resolution';
const metaDescription =
  'Rediscover some of the most forgotten and wanted music records of all time and support the original artists. Welcome to the most innovative tool to collect rare music.';

const ContextScrollMainContent = ({ isMobile }) => {
  const { scrollY } = useScrollerMotion();

  return (
    <motion.div className="motiondiv">
      <MainContent isMobile={isMobile} scrollY={scrollY} />
    </motion.div>
  );
};

function MainPageNotAuthorizedWrapper({ userIsAuthorized }) {
  const { isNotDesktop } = ViewportHook();
  const [isMobile, setIsMobile] = useState();

  useEffect(() => {
    // setIsMobile(
    //   navigator.userAgent.match(/Android/i) ||
    //     navigator.userAgent.match(/BlackBerry/i) ||
    //     navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
    //     navigator.userAgent.match(/Opera Mini/i) ||
    //     navigator.userAgent.match(/IEMobile/i)
    // );
    setIsMobile(window.matchMedia('(max-width: 999px)').matches);
    window.onresize = (event) => {
      console.log(event);
      console.log('is mobile = ', window.matchMedia('(max-width: 999px)').matches);
      setIsMobile(window.matchMedia('(max-width: 999px)').matches);
    };
  }, []);

  console.log('isMobile = ', isMobile);
  if (isMobile === undefined) {
    console.log('is undefined... ');
    return <></>;
  }

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
        description: metaDescription,
      }}
      headerProps={{
        transparent: !userIsAuthorized && !isNotDesktop,
        withTransparent: !isNotDesktop,
        mainLanding: true,
      }}
      withoutHeader
      withoutPaddingTop={!userIsAuthorized && !isNotDesktop}
      withoutFooter
      disableScrollbar
      withoutCustomScrollbar
    >
      {!isMobile ? (
        <ScrollerMotion className="scrollermotion">
          <ContextScrollMainContent isMobile={isMobile} />
        </ScrollerMotion>
      ) : (
        <MainContent isMobile={isMobile} />
      )}
    </BaseWebsiteLayout>
  );
}

export default MainPageNotAuthorizedWrapper;
