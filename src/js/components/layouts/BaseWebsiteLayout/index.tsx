import { useCallback, useEffect, useState } from 'react';

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import type { HeadTagProps } from '@/components/document/head/HeadTag/headTag';
import HeadTag from '@/components/document/head/HeadTag/headTag';
import type { HeaderProps } from '@/components/global/Header';
import Header from '@/components/global/Header';
import type { BaseWebsiteLayoutScrollBarProps } from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutScrollBar';
import BaseWebsiteLayoutScrollBar from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutScrollBar';
import type { RootState } from '@/js/redux/reducers';
import { analyticsUserIdPush } from '@/utils/analytics/analyticsPushers';

type PropsFromRedux = ConnectedProps<typeof connector>;

type BaseWebsiteLayoutProps = HeaderProps &
  Partial<Omit<BaseWebsiteLayoutScrollBarProps, 'setFixedHeader'>> &
  HeadTagProps &
  PropsFromRedux;

function BaseWebsiteLayout({
  headerProps,
  headerProps: { transparent } = {},
  withoutHeader,
  headSettings,
  setScrollValue,

  userIsAuthorized,
  userInfo: { id: userId } = {},
  children,

  ...restProps
}: BaseWebsiteLayoutProps) {
  const [fixedHeader, setFixedHeader] = useState<boolean>(!transparent);

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
      <BaseWebsiteLayoutScrollBar
        setFixedHeader={setFixedHeader}
        withoutHeader={withoutHeader}
        transparent={transparent}
        {...restProps}
      >
        {children}
      </BaseWebsiteLayoutScrollBar>
    </>
  );
}

const connector = connect((state: RootState) => ({
  userInfo: state.AuthReducer.userInfo,
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}));

export default connector(BaseWebsiteLayout);
