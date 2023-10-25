import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageLayout from '@/components/layouts/PageLayout';
import MarketplaceAndPreOrdersPageWrapper from '@/components/MarketplaceAndPreOrdersPageWrapper';
import ProjectsWithFilters from '@/components/projects/list-wrappers/ProjectsWithFilters';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import TitlesConstants from '@/constants/titles/titlesConstants';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { getProjectsRequestAction } from '@/redux-actions/projects/projectsActions';

import styles from './styles.module.scss';

const metaTitle = TitlesConstants.PRE_ORDERS;
const metaDescription = 'Curated music legacy records on the verge of extinction';

function ProjectsWrapper({
  search,

  getProjectsInProcess,
  loadedProjectsFromApi,
  projects,
  pageSettings,

  filtersSelected,
  filtersApplied,
  filterApplied,

  sortSelected,

  previewType,

  getProjects,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
        description: `${metaDescription}.`,
      }}
      shownBanners
    >
      <PageLayout pageTitle={metaTitle} pageDescription={metaDescription}>
        <MarketplaceAndPreOrdersPageWrapper location={ProjectsLocationsConstants.PROJECTS} onGetProjects={getProjects}>
          <ProjectsWithFilters
            location={ProjectsLocationsConstants.PROJECTS}
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
            withMarginBottomMinus
            secondOffset={!isNotDesktop ? 150 : 160}
            withSearch
            listWithPadding={false}
            sideBarLayoutClassName={styles.ProjectsWrapper__sideBar}
            querySearch={search}
          />
        </MarketplaceAndPreOrdersPageWrapper>
      </PageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    search: state.MarketplaceAndPreOrdersFiltersReducer.search,

    getProjectsInProcess: state.DefaultProjectsReducer.getProjectsInProcess,
    loadedProjectsFromApi: state.DefaultProjectsReducer.loadedProjectsFromApi,
    projects: state.DefaultProjectsReducer.projects,
    pageSettings: state.DefaultProjectsReducer.pageSettings,

    filtersSelected: state.DefaultProjectsReducer.filtersSelected,
    filtersApplied: state.DefaultProjectsReducer.filtersApplied,
    filterApplied: state.DefaultProjectsReducer.filterApplied,

    sortSelected: state.DefaultProjectsReducer.sortSelected,

    previewType: state.DefaultProjectsReducer.previewType,
  }),
  (dispatch) => ({
    getProjects: (params) => getProjectsRequestAction(params)(dispatch),
  })
)(ProjectsWrapper);
