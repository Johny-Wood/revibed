import type { PropsWithChildren } from 'react';

import classNames from 'classnames';

import BackButton from '@/components/common-ui/buttons/BackButton';
import SideBarLayout from '@/components/layouts/SideBarLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import PersonalDashboard from '@/components/personal/PersonalDashboard';
import PersonalPageHeader from '@/components/personal/PersonalPageHeader';
import PersonalTabsNavigation from '@/components/personal/PersonalTabsNavigation';
import Preloader from '@/components/ui/Preloader';
import type { TooltipProps } from '@/components/ui/ToolTip';

import styles from './styles.module.scss';

type PersonalPageLayoutProps = PropsWithChildren & {
  name?: string;
  withDashboard?: boolean;
  withSideBar?: boolean;
  withPersonalTabsNavigation?: boolean;
  withProfileBar?: boolean;
  withBorderTop?: boolean;
  preloadInProcess?: boolean;
  sideBarWithBackRoute?: boolean;
  headerText?: string;
  withoutBottomPadding?: boolean;
  withYPadding?: boolean;
  tooltip?: TooltipProps;
  backRouteHrefDefault?: string;
  navigationList?: unknown[];
  pageHeaderClassName?: string;
  headerContent?: () => JSX.Element;
  sideBarChildren?: () => JSX.Element;
};

function PersonalPageLayout({
  name,

  withDashboard = true,
  withSideBar = true,

  headerText,
  headerContent: HeaderContent,
  tooltip,

  sideBarChildren,
  sideBarWithBackRoute,
  backRouteHrefDefault,

  preloadInProcess,

  navigationList,
  withPersonalTabsNavigation = true,
  withBorderTop,
  withProfileBar = true,
  withYPadding,
  withoutBottomPadding,
  pageHeaderClassName,

  children,
}: PersonalPageLayoutProps) {
  const renderAside = () => {
    if (!withSideBar) {
      return null;
    }

    return withDashboard && ((navigationList && navigationList.length > 0) || withProfileBar) ? (
      <PersonalDashboard className={styles.sideBar} navigationList={navigationList} withProfileBar={withProfileBar} />
    ) : (
      <SideBarLayout className={styles.sideBar}>
        {sideBarWithBackRoute && <BackButton hrefDefault={backRouteHrefDefault} />}
        {sideBarChildren}
      </SideBarLayout>
    );
  };

  return (
    <div className={classNames([styles.personal, name])}>
      <SiteWrapperLayout direction="column" firstInPage withYPadding={withYPadding} withoutBottomPadding={withoutBottomPadding}>
        <WrapperContainerLayout direction="column" wrap="wrap">
          <WrapperContainerLayout direction="row" wrap="nowrap">
            {renderAside()}
            <div className={classNames('wrapper__content', withBorderTop && styles.personal_withBorderTop)}>
              {withPersonalTabsNavigation && <PersonalTabsNavigation />}
              <PersonalPageHeader className={pageHeaderClassName} text={headerText} tooltip={tooltip}>
                {!!HeaderContent && <HeaderContent />}
              </PersonalPageHeader>
              <Preloader id={`personal-page-${name}`} isShown={preloadInProcess} duration={400} />
              {children}
            </div>
          </WrapperContainerLayout>
        </WrapperContainerLayout>
      </SiteWrapperLayout>
    </div>
  );
}

export default PersonalPageLayout;
