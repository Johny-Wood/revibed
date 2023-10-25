import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import ProjectsWithFilters from '@/components/projects/list-wrappers/ProjectsWithFilters';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import TitlesConstants from '@/constants/titles/titlesConstants';

const metaTitle = TitlesConstants.PRE_ORDERS;

function MyProjectsPageWrapper({
  getProjectsInProcess,
  loadedProjectsFromApi,
  projects,
  pageSettings,

  filtersSelected,
  filtersApplied,
  filterApplied,

  sortSelected,

  previewType,
}) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <ProjectsWithFilters
          withDiscogsFilters={false}
          location={ProjectsLocationsConstants.MY_PROJECTS}
          projects={projects}
          pageSettings={pageSettings}
          getProjectsInProcess={getProjectsInProcess}
          loadedProjectsFromApi={loadedProjectsFromApi}
          filtersSelected={filtersSelected}
          filtersApplied={filtersApplied}
          filterApplied={filterApplied}
          sortSelected={sortSelected}
          previewType={{
            activePreviewType: previewType,
          }}
        />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  getProjectsInProcess: state.MyProjectsReducer.getProjectsInProcess,
  loadedProjectsFromApi: state.MyProjectsReducer.loadedProjectsFromApi,
  projects: state.MyProjectsReducer.projects,
  pageSettings: state.MyProjectsReducer.pageSettings,

  filtersSelected: state.MyProjectsReducer.filtersSelected,
  filtersApplied: state.MyProjectsReducer.filtersApplied,
  filterApplied: state.MyProjectsReducer.filterApplied,

  sortSelected: state.MyProjectsReducer.sortSelected,

  previewType: state.MyProjectsReducer.previewType,
}))(MyProjectsPageWrapper);
