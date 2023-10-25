import { useEffect } from 'react';

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import type { TabConfig } from '@/components/common/tabs/TabsNavigation';
import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';
import type { RootState } from '@/js/redux/reducers';
import NewArrivals from '@/pages/main-projects/MainProjectsPageWrapper/_components/NewArrivals';
import Trending from '@/pages/main-projects/MainProjectsPageWrapper/_components/Trending';
import { getProjectsRequestAction } from '@/redux-actions/projects/projectsActions';

import styles from './styles.module.scss';

const MAIN_PROJECTS_TABS: TabConfig[] = [
  {
    id: 1,
    title: TitlesConstants.TRENDING,
    href: RoutePathsConstants.MAIN,
    hrefKey: RoutePathsConstants.TRENDING,
    keyMenu: 'TRENDING',
    withActive: false,
    container: Trending,
  },
  {
    id: 2,
    title: TitlesConstants.NEW_ARRIVALS,
    href: RoutePathsConstants.MAIN,
    hrefKey: RoutePathsConstants.NEW_ARRIVALS,
    keyMenu: 'NEW_ARRIVALS',
    withActive: false,
    keyMenuNotification: PersonalNotificationsSectionsConstants.NEW_ARRIVALS,
    container: NewArrivals,
  },
];

type PropsFromRedux = ConnectedProps<typeof connector>;

type MainProjectsTabsProps = PropsFromRedux;

function MainProjectsTabs({ loadedProjectsFromApi, getProjectsInProcess, getProjects }: MainProjectsTabsProps) {
  useEffect(() => {
    if (!loadedProjectsFromApi && !getProjectsInProcess) {
      getProjects({ location: PersonalNotificationsSectionsConstants.NEW_ARRIVALS });
    }
  }, [getProjects, getProjectsInProcess, loadedProjectsFromApi]);

  return (
    <TabsWrapper
      type="NAVIGATION"
      visibleType="TAGS"
      tabs={MAIN_PROJECTS_TABS}
      withActiveClass
      withOffsetBottom={false}
      className={styles.MainProjectsTabs}
    />
  );
}

const connector = connect(
  (state: RootState) => ({
    getProjectsInProcess: state.NewArrivalsProjectsReducer.getProjectsInProcess,
    loadedProjectsFromApi: state.NewArrivalsProjectsReducer.loadedProjectsFromApi,
  }),
  (dispatch) => ({
    // @ts-ignore
    getProjects: (params) => getProjectsRequestAction(params)(dispatch),
  })
);

export default connector(MainProjectsTabs);
