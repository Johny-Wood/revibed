import { useEffect, useRef, useState } from 'react';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import Footer from '@/js/components/global/Footer';
import MainBanner from '@/pages/main-projects/MainPageNotAuthorizedWrapper/_components/MainBanner';

import Collector from './_components/Collectors';
import FanPovered from './_components/FanPovered';
import MainCards from './_components/MainCards';
import Preorders from './_components/Preorders';

import styles from './index.module.scss'

const metaTitle = 'Wanted Vinyl Records, CDs & Cassette Tapes In High Resolution';
const metaDescription =
  'Rediscover some of the most forgotten and wanted music records of all time and support the original artists. Welcome to the most innovative tool to collect rare music.';

function MainPageNotAuthorizedWrapper({ userIsAuthorized, isNotDesktop }) {
  const [scrollValue, setScrollValue] = useState(0);


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
        withoutPaddingTop={!userIsAuthorized && !isNotDesktop}
        onScrollHandler={setScrollValue}
        withoutFooter
      >
      <div className={styles.cont}>
        <div className={styles.cont__child}>
          <MainBanner scrollValue={scrollValue.scrollTop} />
        </div>
        <div className={styles.cont__child}>
          <MainCards />
        </div>
        <div className={styles.cont__child}>
          <FanPovered />
        </div>
        <div className={styles.cont__child}>
          <Preorders />
        </div>
        <div className={styles.cont__child}>
          <Collector scrollObject={scrollValue} />
          <Footer footerProps={{ blackFooter: true }} />
        </div>
      </div>
      </BaseWebsiteLayout>

  );
}

export default MainPageNotAuthorizedWrapper;
