import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';

import Banners from '@/components/global/Banners';
import Footer from '@/components/global/Footer';
import Preloader from '@/components/ui/Preloader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { UseHistory } from '@/contexts/history/History';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ScrollService from '@/services/scroll/ScrollService';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

import styles from './styles.module.scss';

const Messages = dynamic(() => import('@/components/global/Messages'), { ssr: false });

function BaseWebsiteLayoutScrollBar({
  className,
  transparent,
  pageName,
  footerProps,
  withoutHeader,
  withoutFooter,
  withoutFullFooter,
  hideScrollbar,
  preloadInProcess,
  shownBanners,

  children,

  onWheelHandler,

  disableScrollbar,
  scrollIsDisabled,

  onScrollHandler,
  setFixedHeader,

  userIsAuthorized,
}) {
  const { isNotDesktop, height } = ViewportHook();
  const [isReady, setIsReady] = useState(false);

  const {
    unsetActiveScrollPosition,
    history: {
      previous: { scrollPosition: previousScrollPosition, isActive: previousScrollIsActive },
    },
  } = UseHistory();

  const scrollbarRef = useRef(null);

  ScrollService.initialize({
    scrollBarName: CommonScrollbarLocationsConstants.MAIN_SCROLL,
    scrollBarRef: scrollbarRef,
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  const pageHeight = useMemo(() => {
    if (isNotDesktop) {
      return `calc(${height}px - (1rem * ${!withoutHeader ? 61 : 0} / var(--font-size__small-int)))`;
    }
    if ((transparent && !isNotDesktop) || withoutHeader) {
      return height;
    }

    return `calc(${height}px - (1rem * ${!withoutHeader ? 71 : 0} / var(--font-size__small-int)))`;
  }, [height, withoutHeader, transparent, isNotDesktop]);

  const footerHeight = useMemo(() => {
    if (withoutFooter) {
      return 0;
    }

    return covertPx2RemUtil(70 + !withoutFullFooter ? (isNotDesktop ? 145 : 183) : 0);
  }, [withoutFullFooter, withoutFooter, isNotDesktop]);

  const scrollToPrevPagePosition = useCallback(() => {
    if (!previousScrollIsActive) {
      return;
    }

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTo({
      elementTop: previousScrollPosition,
      behavior: 0,
      callback: () => {
        ScrollService.setScrollPosition(previousScrollPosition);
        unsetActiveScrollPosition();
      },
    });
  }, [previousScrollIsActive, previousScrollPosition, unsetActiveScrollPosition]);

  const toggleFixedHeader = useCallback(
    (isFixed) => {
      if (isNotDesktop || !transparent) {
        return;
      }

      setFixedHeader(isFixed);
    },
    [isNotDesktop, setFixedHeader, transparent]
  );

  const onScroll = useCallback(() => {
    const { current: { scrollValues: { scrollTop: scrollTopValue, clientHeight, contentScrollHeight } = {} } = {} } =
      scrollbarRef;

    ScrollService.setScrollPosition(scrollTopValue);
    
    toggleFixedHeader(scrollTopValue > 80);

    if (onScrollHandler) {
      onScrollHandler({ scrollTop: scrollTopValue, clientHeight, contentScrollHeight });
    }
  }, [onScrollHandler, toggleFixedHeader]);

  useEffect(() => {
    if (isReady) return;

    scrollToPrevPagePosition();
    onScroll();
  }, [isReady, onScroll, scrollToPrevPagePosition]);

  useEffect(() => {
    toggleFixedHeader(userIsAuthorized);
  }, [toggleFixedHeader, userIsAuthorized]);

  return (
    <Scrollbar
      ref={scrollbarRef}
      className={classNames(styles.mainScrollbar, !isNotDesktop && hideScrollbar && styles.mainScrollbar_hide, className)}
      scrollerProps={{
        className: 'mainScrollbarScroller',
      }}
      native={hideScrollbar}
      mobileNative={isNotDesktop}
      noScrollX
      noScrollY={disableScrollbar || scrollIsDisabled}
      onScroll={onScroll}
      onWheel={onWheelHandler}
      style={{ height: pageHeight }}
    >
      <>
        <div className={classNames([styles.page, pageName])}>
          <Banners isShown={shownBanners} />
          <Messages />
          {children}
        </div>
        <Preloader
          id={`page-${pageName}`}
          isShown={preloadInProcess}
          opacity={1}
          fullScreen
          pageHeight={`calc(${pageHeight} - ${footerHeight})`}
        />
        {!withoutFooter && <Footer footerProps={footerProps} />}
      </>
    </Scrollbar>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  scrollIsDisabled: state.ScrollReducer.isDisabled,
}))(BaseWebsiteLayoutScrollBar);
