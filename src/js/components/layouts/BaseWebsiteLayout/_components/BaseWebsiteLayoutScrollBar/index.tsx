import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';

import Banners from '@/components/global/Banners';
import type { FooterExternalProps } from '@/components/global/Footer';
import Footer from '@/components/global/Footer';
import Preloader from '@/components/ui/Preloader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { UseHistory } from '@/contexts/history/History';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import type { RootState } from '@/js/redux/reducers';
import ScrollService from '@/services/scroll/ScrollService';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

import styles from './styles.module.scss';

const Messages = dynamic(() => import('@/components/global/Messages'), { ssr: false });

type ScrollValues = {
  scrollTop: number;
  clientHeight: number;
  contentScrollHeight: number;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

export type BaseWebsiteLayoutScrollBarProps = PropsWithChildren &
  PropsFromRedux &
  FooterExternalProps & {
    withoutFooter?: boolean;
    withoutFullFooter?: boolean;
    withoutHeader?: boolean;
    hideScrollbar?: boolean;
    preloadInProcess?: boolean;
    shownBanners?: boolean;
    transparent?: boolean;
    disableScrollbar?: boolean;
    pageName?: string;

    className?: string;

    setFixedHeader?: (isFixed: boolean) => void;
    onScrollHandler?: (scrollValues: ScrollValues) => void;
    onWheelHandler?: () => void;
  };

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
}: BaseWebsiteLayoutScrollBarProps) {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { isNotDesktop, height } = ViewportHook();

  const {
    unsetActiveScrollPosition,
    history: {
      previous: { scrollPosition: previousScrollPosition, isActive: previousScrollIsActive },
    },
  } = UseHistory();

  const scrollbarRef = useRef<Scrollbar>(null);

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

    return covertPx2RemUtil(70 + (!withoutFullFooter ? (isNotDesktop ? 145 : 183) : 0));
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
    (isFixed: boolean) => {
      if (isNotDesktop || !transparent || !setFixedHeader) {
        return;
      }

      setFixedHeader(isFixed);
    },
    [isNotDesktop, setFixedHeader, transparent]
  );

  const onScroll = useCallback(() => {
    if (scrollbarRef.current) {
      const { scrollTop, clientHeight, contentScrollHeight } = scrollbarRef.current.getScrollState(true);

      ScrollService.setScrollPosition(scrollTop);

      toggleFixedHeader(scrollTop > 80);

      if (onScrollHandler) {
        onScrollHandler({
          scrollTop,
          clientHeight,
          contentScrollHeight,
        });
      }
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
      // @ts-ignore
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

const connector = connect((state: RootState) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  scrollIsDisabled: state.ScrollReducer.isDisabled,
}));

export default connector(BaseWebsiteLayoutScrollBar);
