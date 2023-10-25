import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import ProjectsWithFilters from '@/components/projects/list-wrappers/ProjectsWithFilters';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import UserWrapperLayout from '@/pages/users/UserWrapperLayout';
import { resetGetProjectsFromApiAction } from '@/redux-actions/projects/projectsActions';

const TITLE = 'Projects';

function UserProjectWrapper({
  getProjectsInProcess,
  loadedProjectsFromApi,
  projects,
  pageSettings,

  filtersSelected,
  filtersApplied,
  filterApplied,

  sortSelected,

  resetGetProjectsFromApi,

  previewType,
}) {
  const router = useRouter();
  const { query: { userId } = {} } = router || {};

  useEffect(
    () => () => {
      resetGetProjectsFromApi();
    },
    [resetGetProjectsFromApi]
  );

  return (
    <UserWrapperLayout title={TITLE}>
      <ProjectsWithFilters
        withDiscogsFilters={false}
        location={ProjectsLocationsConstants.PROJECTS_USER}
        projects={projects}
        pageSettings={pageSettings}
        getProjectsInProcess={getProjectsInProcess}
        loadedProjectsFromApi={loadedProjectsFromApi}
        filtersSelected={filtersSelected}
        filtersApplied={filtersApplied}
        filterApplied={filterApplied}
        sortSelected={sortSelected}
        userId={userId}
        previewType={{
          activePreviewType: previewType,
        }}
      />
    </UserWrapperLayout>
  );
}

export default connect(
  (state) => ({
    getProjectsInProcess: state.UserProjectsReducer.getProjectsInProcess,
    loadedProjectsFromApi: state.UserProjectsReducer.loadedProjectsFromApi,
    projects: state.UserProjectsReducer.projects,
    pageSettings: state.UserProjectsReducer.pageSettings,

    filtersSelected: state.UserProjectsReducer.filtersSelected,
    filtersApplied: state.UserProjectsReducer.filtersApplied,
    filterApplied: state.UserProjectsReducer.filterApplied,

    sortSelected: state.UserProjectsReducer.sortSelected,

    previewType: state.UserProjectsReducer.previewType,
  }),
  (dispatch) => ({
    resetGetProjectsFromApi: () => {
      dispatch(resetGetProjectsFromApiAction(ProjectsLocationsConstants.PROJECTS_USER, true));
    },
  })
)(UserProjectWrapper);
