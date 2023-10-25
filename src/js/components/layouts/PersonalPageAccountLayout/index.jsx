import { UserAuthorized } from '@/components/layouts/AuthLayouts';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import { PersonalAccountNavigationConstants } from '@/constants/navigations/personal';
import { RoutePathsConstants } from '@/constants/routes/routes';

function PersonalPageAccountLayout({ headerText, children }) {
  return (
    <PersonalPageLayout
      headerText={headerText}
      navigationList={PersonalAccountNavigationConstants}
      withPersonalTabsNavigation={false}
      withProfileBar={false}
      withBorderTop
      sideBarWithBackRoute
      backRouteHrefDefault={RoutePathsConstants.MY_PROJECTS}
    >
      <UserAuthorized>{children}</UserAuthorized>
    </PersonalPageLayout>
  );
}

export default PersonalPageAccountLayout;
