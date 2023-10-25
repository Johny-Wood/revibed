import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import ProjectsWithFilters from '@/components/projects/list-wrappers/ProjectsWithFilters';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import ViewportHook from '@/hooks/viewport/ViewportHook';

const TITLE = 'Ripper';

function RipperProjectsWrapper({
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
  const { isNotDesktop } = ViewportHook();

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      shownBanners
    >
      <PersonalPageLayout headerText={isNotDesktop ? TITLE : ''}>
        <ProjectsWithFilters
          withDiscogsFilters={false}
          location={ProjectsLocationsConstants.RIPPER}
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
  getProjectsInProcess: state.RipperProjectsReducer.getProjectsInProcess,
  loadedProjectsFromApi: state.RipperProjectsReducer.loadedProjectsFromApi,
  projects: state.RipperProjectsReducer.projects,
  pageSettings: state.RipperProjectsReducer.pageSettings,

  filtersSelected: state.RipperProjectsReducer.filtersSelected,
  filtersApplied: state.RipperProjectsReducer.filtersApplied,
  filterApplied: state.RipperProjectsReducer.filterApplied,

  sortSelected: state.RipperProjectsReducer.sortSelected,

  previewType: state.RipperProjectsReducer.previewType,
}))(RipperProjectsWrapper);
