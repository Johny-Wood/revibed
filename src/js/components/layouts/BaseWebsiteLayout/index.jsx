import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HeadTag from '@/components/document/head/HeadTag';
import Header from '@/components/global/Header';
import BaseWebsiteLayoutScrollBar from '@/components/layouts/BaseWebsiteLayout/_components/BaseWebsiteLayoutScrollBar';
import { analyticsUserIdPush } from '@/utils/analytics/analyticsPushers';

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
}) {
  const [fixedHeader, setFixedHeader] = useState(!transparent);
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

BaseWebsiteLayout.defaultProps = {
  withoutPaddingTop: false,
  withoutHeader: false,
  withoutFooter: false,
  preloadInProcess: false,
  pageName: '',
  shownBanners: false,
  hideScrollbar: false,
  pageBackground: undefined,
  headerProps: {},
  footerProps: {},
  onWheelHandler: () => {},
};

BaseWebsiteLayout.propTypes = {
  withoutPaddingTop: PropTypes.bool,
  withoutHeader: PropTypes.bool,
  withoutFooter: PropTypes.bool,
  preloadInProcess: PropTypes.bool,
  pageName: PropTypes.string,
  shownBanners: PropTypes.bool,
  hideScrollbar: PropTypes.bool,
  pageBackground: PropTypes.object,
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
  onWheelHandler: PropTypes.func,
};

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(BaseWebsiteLayout);
