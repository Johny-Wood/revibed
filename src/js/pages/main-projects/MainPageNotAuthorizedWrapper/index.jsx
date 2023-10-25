import { useEffect, useState } from 'react';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import Footer from '@/js/components/global/Landing/Footer';
import MainBanner from '@/pages/main-projects/MainPageNotAuthorizedWrapper/_components/MainBanner';

import Collector from './_components/Collectors';
import FanPovered from './_components/FanPovered';
import MainCards from './_components/MainCards';
import Preorders from './_components/Preorders';

const metaTitle = 'Wanted Vinyl Records, CDs & Cassette Tapes In High Resolution';
const metaDescription =
  'Rediscover some of the most forgotten and wanted music records of all time and support the original artists. Welcome to the most innovative tool to collect rare music.';

function MainPageNotAuthorizedWrapper({ userIsAuthorized, isNotDesktop }) {
  const [scrollValue, setScrollValue] = useState(0);

  const footerProps = {
    blackFooter: true,
  };

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
        description: metaDescription,
      }}
      headerProps={{
        transparent: !userIsAuthorized && !isNotDesktop,
        withTransparent: true,
        mainLanding: true,
      }}
      withoutPaddingTop={!userIsAuthorized && !isNotDesktop}
      onScrollHandler={setScrollValue}
      withoutFooter
      // footerProps={footerProps}
    >
      <MainBanner scrollValue={scrollValue.scrollTop} />
      <MainCards />
      <FanPovered />
      <Preorders />
      <Collector scrollObject={scrollValue} />
      <Footer footerProps={{blackFooter: true}}/>
    </BaseWebsiteLayout>
  );
}

export default MainPageNotAuthorizedWrapper;
