import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import type { HeadTagProps } from '@/components/document/head/HeadTag/headTag';
import HeadTag from '@/components/document/head/HeadTag/headTag';
import type { HeaderProps } from '@/components/global/Header';
import Header from '@/components/global/Header';
import BaseWebsiteLayoutContent from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutContent';
import type { BaseWebsiteLayoutScrollBarProps } from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutScrollBar';
import BaseWebsiteLayoutScrollBar from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutScrollBar';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import type { RootState } from '@/js/redux/reducers';
import { analyticsUserIdPush } from '@/utils/analytics/analyticsPushers';
import { ScrollerMotion } from 'scroller-motion';

type PropsFromRedux = ConnectedProps<typeof connector>;

type BaseWebsiteLayoutProps = HeaderProps &
  Partial<Omit<BaseWebsiteLayoutScrollBarProps, 'setFixedHeader'>> &
  HeadTagProps &
  PropsFromRedux & {
    withoutCustomScrollbar?: boolean;
    withoutHeader?: boolean;
  };

function BaseWebsiteLayout({
  headerProps,
  headerProps: { transparent } = {},
  withoutHeader,
  headSettings,
  withoutCustomScrollbar,
  userIsAuthorized,
  userInfo: { id: userId } = {},
  children,

  ...restProps
}: BaseWebsiteLayoutProps) {
  const [fixedHeader, setFixedHeader] = useState<boolean>(!transparent);

  const { isNotDesktop, height } = ViewportHook();

  const pageHeight = useMemo(() => {
    if (isNotDesktop) {
      return `calc(${height}px - (1rem * ${!withoutHeader ? 61 : 0} / var(--font-size__small-int)))`;
    }
    if ((transparent && !isNotDesktop) || withoutHeader) {
      return height;
    }

    return `calc(${height}px - (1rem * ${!withoutHeader ? 71 : 0} / var(--font-size__small-int)))`;
  }, [height, withoutHeader, transparent, isNotDesktop]);

  const analyticsUserIdPushMethod = useCallback(() => {
    if (userIsAuthorized) {
      analyticsUserIdPush(userId);
    }
  }, [userId, userIsAuthorized]);

  useEffect(() => {
    analyticsUserIdPushMethod();
  }, [analyticsUserIdPushMethod]);

  useEffect(() => {
    if (userIsAuthorized) {
      analyticsUserIdPushMethod();
    }
  }, [analyticsUserIdPushMethod, userIsAuthorized]);

  return (
    <>
      <HeadTag headSettings={headSettings} />
      {!withoutHeader && <Header headerProps={headerProps} fixedHeader={fixedHeader} withTransition />}
      {!withoutCustomScrollbar ? (
        <BaseWebsiteLayoutScrollBar
          setFixedHeader={setFixedHeader}
          pageHeight={pageHeight}
          transparent={transparent}
          {...restProps}
        >
          <BaseWebsiteLayoutContent pageHeight={pageHeight} withoutCustomScrollbar={withoutCustomScrollbar} {...restProps}>
            <ScrollerMotion>
              {children}
            </ScrollerMotion>
          </BaseWebsiteLayoutContent>
        </BaseWebsiteLayoutScrollBar>
      ) : (
        <BaseWebsiteLayoutContent pageHeight={pageHeight} withoutCustomScrollbar={withoutCustomScrollbar} {...restProps}>
          {children}
        </BaseWebsiteLayoutContent>
      )}

    </>
  );
}

const connector = connect((state: RootState) => ({
  userInfo: state.AuthReducer.userInfo,
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
})
);

export default connector(BaseWebsiteLayout);
