import { useEffect, useState } from 'react';

import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';

import MainJoinBanner from '@/components/common/auth-banner/MainJoinBanner';
import Projects from '@/components/projects/Projects';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { getTrendingListRequestAction } from '@/redux-actions/trending/trendingActions';

import styles from './styles.module.scss';

function Trending({
  projectsInfo,
  trendingInfo,
  getTrendingListInProcess,
  getTrendingListFromApi,
  pageSettings,
  getTrendingListRequest,
  userIsAuthorized,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!getTrendingListFromApi) {
      getTrendingListRequest();
    }
  }, [getTrendingListFromApi, getTrendingListRequest]);

  const projects = orderBy(trendingInfo, ['currentPosition'], ['asc']).map(
    ({ currentPosition, projectId, isNew, lastPosition }) => ({
      currentPosition,
      lastPosition,
      isNew,
      ...(projectsInfo.find((project) => project.id === projectId) || {}),
    })
  );

  return (
    <div className={styles.trending}>
      <Projects
        projectBlockClassName={styles.trending__projectBlock}
        customItem={!userIsAuthorized && projects.length > 6 ? MainJoinBanner : null}
        location={ProjectsLocationsConstants.TRENDING}
        withAnimation={getTrendingListFromApi && isMounted}
        withRating
        infinityScroll
        projects={projects}
        projectsLength={projects.length}
        isFullType
        withSort={false}
        withDiscogsFilters={false}
        loadedProjectsFromApi={getTrendingListFromApi}
        getProjectsInProcess={getTrendingListInProcess}
        withPagination={false}
        withFilters={false}
        pageSettings={pageSettings}
      />
    </div>
  );
}

export default connect(
  (state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    variablesList: state.VariablesReducer.variablesList,
    projectsInfo: state.TrendingReducer.projects,
    trendingInfo: state.TrendingReducer.trendingInfo,
    getTrendingListFromApi: state.TrendingReducer.getTrendingListFromApi,
    getTrendingListInProcess: state.TrendingReducer.getTrendingListInProcess,
    pageSettings: state.TrendingReducer.pageSettings,
  }),
  (dispatch) => ({
    getTrendingListRequest: () => getTrendingListRequestAction({ dispatch }),
  })
)(Trending);
