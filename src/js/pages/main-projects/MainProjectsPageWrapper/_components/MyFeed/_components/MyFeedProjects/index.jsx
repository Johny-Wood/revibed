import { useEffect, useRef } from 'react';

import { connect } from 'react-redux';

import Projects from '@/components/projects/Projects';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsLocationsMapConstants } from '@/constants/projects/locationsMap';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import NoResultsFollowing from '@/pages/main-projects/MainProjectsPageWrapper/_components/MyFeed/_components/NoResultsFollowing';
import NoResultsNotFollowing from '@/pages/main-projects/MainProjectsPageWrapper/_components/MyFeed/_components/NoResultsNotFollowing';
import { getFeedRequestAction } from '@/redux-actions/feedActions';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

function MyFeedProjects({
  location = ProjectsLocationsConstants.MY_FEED,
  projects,
  getProjectsInProcess,
  loadedProjectsFromApi,
  pageSettings,
  userInfo: { subscriptionsCount = 0 } = {},
  getFeedRequest,
}) {
  const projectsRef = useRef(null);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      `${ScrollBlockIdConstants.PROJECTS_BLOCK_ID}_${location}`,
      ProjectsLocationsMapConstants[location],
      projectsRef
    );
  }, [location]);

  return (
    <Projects
      className={styles.mainProjectsMyFeedContainer}
      infinityScroll
      projects={projects.map(({ project, reasons }) => ({ ...project, reasons }))}
      location={ProjectsLocationsConstants.MY_FEED}
      projectsLength={projects.length}
      isFullType
      withReasons
      withSort={false}
      withDiscogsFilters={false}
      withFilters={false}
      loadedProjectsFromApi={loadedProjectsFromApi}
      getProjectsInProcess={getProjectsInProcess}
      withPagination={false}
      externalGetProjects={getFeedRequest}
      pageSettings={pageSettings}
      noResults={{
        text: null,
        component: subscriptionsCount > 0 ? NoResultsFollowing : NoResultsNotFollowing,
      }}
    />
  );
}

export default connect(
  (state) => ({
    projects: state.MyFeedReducer.projects,
    getProjectsInProcess: state.MyFeedReducer.getProjectsInProcess,
    loadedProjectsFromApi: state.MyFeedReducer.loadedProjectsFromApi,
    pageSettings: state.MyFeedReducer.pageSettings,
    userInfo: state.AuthReducer.userInfo,
  }),
  (dispatch) => ({
    getFeedRequest: (params) =>
      getFeedRequestAction({
        ...params,
        withoutSave: false,
        savePageSettings: true,
        dispatch,
      }),
  })
)(MyFeedProjects);
