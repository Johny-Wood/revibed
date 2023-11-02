import { connect } from 'react-redux';
import MarketplaceAndPreOrdersSearch from 'src/js/components/MarketplaceAndPreOrdersSearch';

import ToStartPreOrderBlackBanner from '@/components/common/banners/ToStartPreOrderBlackBanner';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PageLayout from '@/components/layouts/PageLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import ProjectsWithFilters from '@/components/projects/list-wrappers/ProjectsWithFilters';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import TitlesConstants from '@/constants/titles/titlesConstants';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { getProjectsRequestAction, setProjectsSearchAction } from '@/redux-actions/projects/projectsActions';

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
  setProjectsSearch,
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
        <SiteWrapperLayout direction="column" firstInPage>
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
            querySearch={search}
            customListPageBanner={<ToStartPreOrderBlackBanner isMobile />}
          >
            <MarketplaceAndPreOrdersSearch
              location={ProjectsLocationsConstants.PROJECTS}
              onGetProjects={getProjects}
              search={search}
              onChangeSearch={(newSearch) => {
                setProjectsSearch({
                  search: newSearch,
                  location: ProjectsLocationsConstants.PROJECTS,
                });
              }}
            />
          </ProjectsWithFilters>
          <ToStartPreOrderBlackBanner className={styles.ProjectsWrapper__fullBanner} />
        </SiteWrapperLayout>
      </PageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    search: state.DefaultProjectsReducer.search,

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
    setProjectsSearch: (params) => {
      dispatch(setProjectsSearchAction(params));
    },
  })
)(ProjectsWrapper);
