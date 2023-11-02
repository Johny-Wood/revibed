import { useEffect, useRef } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import AboutUsJoinBanner from '@/components/common/auth-banner/AboutUsJoinBanner';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonHeadConstants } from '@/constants/common/head';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import AboutUsHeader from '@/pages/help/about-us/AboutUsWrapper/_components/AboutUsHeader';
import AboutUsImageSection from '@/pages/help/about-us/AboutUsWrapper/_components/AboutUsImageSection';
import AboutUsInfoSection from '@/pages/help/about-us/AboutUsWrapper/_components/AboutUsInfoSection';
import AboutUsSection from '@/pages/help/about-us/AboutUsWrapper/_components/AboutUsSection';
import ScrollService from '@/services/scroll/ScrollService';

import Primary1 from './_images/about-us-1-primary.png';
import Secondary1 from './_images/about-us-1-secodary.png';
import Primary2 from './_images/about-us-2-primary.png';
import Primary3 from './_images/about-us-3-primary.png';
import Secondary3 from './_images/about-us-3-secodary.png';
import Primary4 from './_images/about-us-4-primary.png';
import Secondary4 from './_images/about-us-4-secodary.png';
import Primary5 from './_images/about-us-5-primary.png';
import Secondary5One from './_images/about-us-5-secodary_1.png';
import Secondary5Two from './_images/about-us-5-secodary_2.png';
import Primary6 from './_images/about-us-6-primary.png';
import Secondary6 from './_images/about-us-6-secodary.png';
import styles from './styles.module.scss';

const sections = [
  {
    title: () => (
      <>
        The best place
        <br />
        to&nbsp;discover new music
      </>
    ),
    text: () => (
      <>
        {CommonHeadConstants.SITE_NAME} tools and your digging expertise create opportunities like never before. Thousands
        of&nbsp;music collectors, curators, DJs, and record diggers from all over the globe come together to&nbsp;share and
        crowdfund obscure vinyl records, CD&rsquo;s and rare cassette tapes.
      </>
    ),
    linkText: 'Discover rare records',
    href: RoutePathsConstants.PROJECTS,
  },
  {
    title: () => (
      <>
        Support
        <br />
        original music artists
      </>
    ),
    text: () => (
      <>
        Our Fund for Original Music Artists is&nbsp;the first step in&nbsp;making long-lost music celebrated again, and
        a&nbsp;cornerstone of&nbsp;how {CommonHeadConstants.SITE_NAME} wants to&nbsp;revive and support forgotten music and the
        artists that created&nbsp;it. With every completed pre-order, the {CommonHeadConstants.SITE_NAME} community helps
        to&nbsp;set funds aside that will go&nbsp;directly to&nbsp;the original artists or&nbsp;their relatives.
      </>
    ),
    linkText: 'Fund for Original Music Artists',
    href: RoutePathsConstants.FAQ_PROJECT_ARTIST_FUND,
  },
  {
    title: () => (
      <>
        We&nbsp;know all about
        <br />
        record digitization
      </>
    ),
    text: () => (
      <>
        Enjoy high resolution music and some of&nbsp;the most incredible forgotten releases. We&nbsp;offer audiophile quality
        sound digitization and innovative digging and discovery tools for music enthusiasts worldwide.
      </>
    ),
    linkText: 'How It Works',
    href: RoutePathsConstants.HOW_IT_WORKS,
  },
  {
    title: () => (
      <>
        Never miss out
        <br />
        on&nbsp;a&nbsp;record you want
      </>
    ),
    text: () => (
      <>
        With our{' '}
        <LinkRoute
          href={RoutePathsConstants.WANTLIST_TOOL}
          text="Wantlist Tool"
          className="underline c-gray-2"
          textClassName={styles.wantlistTool__link}
        />{' '}
        you can continuously monitor those records you&rsquo;ve been after for a&nbsp;while and get instant notifications the
        moment they become available. Be&nbsp;the first to&nbsp;secure a&nbsp;copy and start a&nbsp;new pre-order.
      </>
    ),
    linkText: 'Learn more about our Wantlist Tool',
    href: RoutePathsConstants.WANTLIST_TOOL,
  },
  {
    title: () => (
      <>
        We&nbsp;are all Founders
        <br />
        &amp;&nbsp;Contributors
      </>
    ),
    text: () => (
      <>
        Founders are community members who find an&nbsp;interesting record, CD&nbsp;or cassette tape and start a&nbsp;new
        pre-order to&nbsp;preserve and digitize it&nbsp;via{' '}
        <LinkRoute
          href={RoutePathsConstants.FAQ_CROWDFUNDING_PROJECTS}
          text={`${CommonHeadConstants.SITE_NAME} funding`}
          className="underline c-gray-2"
          textClassName={styles.wantlistTool__link}
        />
        . Contributors are members who support the pre-order via crowdfunding. Cuts can be&nbsp;bought until the pre-order
        is&nbsp;100% funded. The roles of&nbsp;founder and contributor are not mutually exclusive.
        <br />
        <br />
        All investments are returned to&nbsp;the founder &amp;&nbsp;contributors if&nbsp;the pre-order doesn&rsquo;t fully fund
        or&nbsp;doesn&rsquo;t reach the.
      </>
    ),
    linkText: `Join ${CommonHeadConstants.SITE_NAME}`,
    href: RoutePathsConstants.SIGN_IN,
    isNotAuth: true,
  },
  {
    title: () => (
      <>
        Preserve
        <br />
        analogue media
      </>
    ),
    text: () => (
      <>
        Help fund the preservation and digitization of&nbsp;some of&nbsp;the most precious world music songs and protect them for
        future generations. Together we&nbsp;can keep incredible music alive.
      </>
    ),
    linkText: `Join ${CommonHeadConstants.SITE_NAME} to find out more`,
    href: RoutePathsConstants.SIGN_IN,
    isNotAuth: true,
  },
];

const metaTitle = 'Discover records and preserve the musics of the world';

function AboutUsWrapper({ userIsAuthorized }) {
  const { isNotDesktop } = ViewportHook();

  const scrollRef = useRef(null);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      ScrollBlockIdConstants.ABOUT_US,
      RoutePathsConstants.ABOUT_US,
      scrollRef
    );
  });

  return (
    <BaseWebsiteLayout
      headerProps={{
        transparent: !userIsAuthorized && !isNotDesktop,
        withTransparent: true,
      }}
      headSettings={{
        title: metaTitle,
        withSiteName: false,
      }}
    >
      <div className={classNames([styles.aboutUs, globalStyles.breakWord])}>
        <AboutUsHeader scrollRef={scrollRef} isTopOffsetMinus={!isNotDesktop && userIsAuthorized} />
        <AboutUsSection className={styles.aboutUs__section_1} ref={scrollRef}>
          <AboutUsImageSection
            priority
            primaryImg={Primary1}
            primaryImgParams={{
              width: isNotDesktop ? 280 : 800 / 2,
              height: isNotDesktop ? 350 : 1000 / 2,
              className: styles.aboutUs__section_1__primary,
            }}
            secondaryImg={Secondary1}
            secondaryImgParams={{
              width: isNotDesktop ? 274 : 874 / 2,
              height: isNotDesktop ? 220 : 702 / 2,
              className: styles.aboutUs__section_1__secondary,
            }}
          />
          <AboutUsInfoSection {...sections[0]} />
        </AboutUsSection>
        <AboutUsSection className={styles.aboutUs__section_2}>
          <AboutUsInfoSection {...sections[1]} />
          <AboutUsImageSection
            priority
            primaryImg={Primary2}
            primaryImgParams={{
              width: isNotDesktop ? 670 : 1430 / 2,
              height: isNotDesktop ? 490 : 1042 / 2,
              className: styles.aboutUs__section_2__primary,
            }}
          />
        </AboutUsSection>
        <AboutUsSection className={styles.aboutUs__section_3}>
          <AboutUsImageSection
            primaryImg={Primary3}
            primaryImgParams={{
              width: isNotDesktop ? 280 : 858 / 2,
              height: isNotDesktop ? 322 : 986 / 2,
              className: styles.aboutUs__section_3__primary,
            }}
            secondaryImg={Secondary3}
            secondaryImgParams={{
              width: isNotDesktop ? 224 : 698 / 2,
              height: isNotDesktop ? 259 : 806 / 2,
              className: styles.aboutUs__section_3__secondary,
            }}
          />
          <AboutUsInfoSection {...sections[2]} />
        </AboutUsSection>
        <AboutUsSection className={styles.aboutUs__section_4}>
          <AboutUsInfoSection {...sections[3]} />
          <AboutUsImageSection
            primaryImg={Primary4}
            primaryImgParams={{
              width: isNotDesktop ? 340 : 1355 / 2,
              height: isNotDesktop ? 340 : 1372 / 2,
              className: styles.aboutUs__section_4__primary,
            }}
            secondaryImg={Secondary4}
            secondaryImgParams={{
              width: isNotDesktop ? 262 : 770 / 2,
              height: isNotDesktop ? 244 : 735 / 2,
              className: styles.aboutUs__section_4__secondary,
            }}
          />
        </AboutUsSection>
        <AboutUsSection className={styles.aboutUs__section_5}>
          <AboutUsImageSection
            primaryImg={Primary5}
            primaryImgParams={{
              width: isNotDesktop ? 320 : 965 / 2,
              height: isNotDesktop ? 330 : 1000 / 2,
              className: styles.aboutUs__section_5__primary,
            }}
            secondaryImg={Secondary5One}
            secondaryImgParams={{
              width: isNotDesktop ? 157 : 435 / 2,
              height: isNotDesktop ? 186 : 514 / 2,
              className: styles.aboutUs__section_5__secondary_1,
            }}
            secondaryImg2={Secondary5Two}
            secondaryImg2Params={{
              width: isNotDesktop ? 156 : 433 / 2,
              height: isNotDesktop ? 186 : 514 / 2,
              className: styles.aboutUs__section_5__secondary_2,
            }}
          />
          <AboutUsInfoSection {...sections[4]} />
        </AboutUsSection>
        <AboutUsSection className={styles.aboutUs__section_6}>
          <AboutUsInfoSection textClassName={styles.aboutUs__section_6__text} {...sections[5]} />
          <AboutUsImageSection
            primaryImg={Primary6}
            primaryImgParams={{
              width: isNotDesktop ? 375 : 1029 / 2,
              height: isNotDesktop ? 426 : 1186 / 2,
              className: styles.aboutUs__section_6__primary,
            }}
            secondaryImg={Secondary6}
            secondaryImgParams={{
              width: isNotDesktop ? 234 : 608 / 2,
              height: isNotDesktop ? 240 : 627 / 2,
              className: styles.aboutUs__section_6__secondary,
            }}
          />
        </AboutUsSection>
        <AboutUsJoinBanner />
      </div>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(AboutUsWrapper);
