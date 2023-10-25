import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import Preloader from '@/components/ui/Preloader';
import PlanWantList from '@/components/wantList/plan/PlanWantList';
import { RoutePathsConstants } from '@/constants/routes/routes';

function WantListPlanPageWrapper({ loadPlanWantListFromApi }) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: 'Wantlist Plan',
      }}
      pageName="wantlist"
      shownBanners
    >
      <PersonalPageLayout
        headerText="Select Plan"
        withPersonalTabsNavigation={false}
        withDashboard={false}
        withProfileBar={false}
        sideBarWithBackRoute
        backRouteHrefDefault={RoutePathsConstants.WANTLIST}
      >
        <Preloader id="tariff-plan" isShown={!loadPlanWantListFromApi} duration={400} />
        <PlanWantList />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  loadPlanWantListFromApi: state.WantListReducer.loadPlanWantListFromApi,
}))(WantListPlanPageWrapper);
