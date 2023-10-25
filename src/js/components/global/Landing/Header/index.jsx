import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import AuthorizedControls from '@/components/global/Header/_components/AuthorizedControls';
import HeaderMenu from '@/components/global/Header/_components/HeaderMenu';
import HeaderNavLayout from '@/components/global/Header/_components/HeaderNavLayout';
import HeaderSearch from '@/components/global/Header/_components/HeaderSearch';
import NotAuthorizedControls from '@/components/global/Header/_components/NotAuthorizedControls';
import ProjectHeaderSearchLink from '@/components/global/Header/_components/ProjectHeaderSearchLink';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import Logo from '@/components/primary/Logo';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonHeadConstants } from '@/constants/common/head';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { HeaderNavigationConstants } from '@/constants/navigations/main';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

const LHeader = ({ headerProps: { transparent, withTransparent, mainLanding } = {}, fixedHeader, withTransition,  }) => {
  const [shownSearch, setShownSearch] = useState(false);

  const headerRef = useRef(null);

  const color = useMemo(() => (transparent && !fixedHeader ? 'white' : 'black'), [fixedHeader, transparent]);

  const setScrollTopOffset = useCallback(() => {
    if (headerRef && headerRef.current) {
      const { height } = headerRef.current.getBoundingClientRect();

      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).setTopOffset(height);
    }
  }, []);

  useEffect(() => {
    setScrollTopOffset();
  }, [setScrollTopOffset]);

  return (
    <header
      ref={headerRef}
      className={classNames(
        styles.header,
        transparent && styles.header_transparent,
        fixedHeader && styles.header_fixed,
        withTransition && withTransparent && transparent && styles.header_transition,
        mainLanding && styles.header_mainLanding
      )}
    >
      <div className={styles.header_wrapper}>
        <div className={styles.header_left}>
          <LinkRoute href="/" title={CommonHeadConstants.SITE_NAME} className="main-logo">
            <Logo color={color} />
          </LinkRoute>

          <DesktopLayout>
          { !mainLanding &&   <HeaderSearch iconColor={color} shown={shownSearch} toggleShow={setShownSearch} /> }
          </DesktopLayout>
        </div>
        <DesktopLayout>
          <TransitionSwitchLayout isShown={!shownSearch} duration={400} name="fade-delay">
            <HeaderNavLayout>
              <HeaderMenu transparent={transparent} fixedHeader={fixedHeader} links={HeaderNavigationConstants} />
            </HeaderNavLayout>
          </TransitionSwitchLayout>
        </DesktopLayout>
        <MobileLayout>
          <ProjectHeaderSearchLink />
        </MobileLayout>
        <NotAuthorizedControls />
        <AuthorizedControls color={color} />
      </div>
    </header>
  );
};

export default LHeader;
