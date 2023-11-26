import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Scrollbar from 'react-scrollbars-custom';

import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { UseHistory } from '@/contexts/history/History';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import type { RootState } from '@/js/redux/reducers';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

type ScrollValues = {
  scrollTop: number;
  clientHeight: number;
  contentScrollHeight: number;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

export type BaseWebsiteLayoutScrollBarProps = PropsWithChildren &

  PropsFromRedux & {
    pageHeight?: string | number;
    hideScrollbar?: boolean;

    transparent?: boolean;
    disableScrollbar?: boolean;
    className?: string;
    setFixedHeader?: (isFixed: boolean) => void;
    onScrollHandler?: (scrollValues: ScrollValues) => void;
    onWheelHandler?: () => void;
  };

function BaseWebsiteLayoutScrollBar({
  className,
  transparent,

  pageHeight,
  hideScrollbar,

  onWheelHandler,

  disableScrollbar,
  scrollIsDisabled,

  onScrollHandler,
  setFixedHeader,

  userIsAuthorized,
  children,

}: BaseWebsiteLayoutScrollBarProps) {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { isNotDesktop } = ViewportHook();

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
      {children}
    </Scrollbar>
  );
}

const connector = connect((state: RootState) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  scrollIsDisabled: state.ScrollReducer.isDisabled,
}));

export default connector(BaseWebsiteLayoutScrollBar);
