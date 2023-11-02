import { useCallback, useEffect } from 'react';

import { connect } from 'react-redux';

import RetractableMenu from '@/components/common/RetractableMenu';
import SideBarLayout from '@/components/layouts/SideBarLayout';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import ProjectsProps from '@/components/projects/_config/props';
import ProjectsTypes from '@/components/projects/_config/types';
import styles from '@/components/projects/ProjectList/styles.module.scss';
import Projects from '@/components/projects/Projects';
import DiscogsTypeFilters from '@/components/projects/ProjectsFilters/DiscogsTypeFilters';
import ProjectTypeFilters from '@/components/projects/ProjectsFilters/ProjectTypeFilters';
import ProjectsSortBy from '@/components/projects/ProjectsSortBy';
import ProjectTypePreviewControl from '@/components/projects/ProjectTypePreviewControl';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import FilterIcon from '@/icons/FilterIcon';
import {
  applyProjectsFilterAction,
  getProjectsRequestAction,
  selectProjectsFilterAction,
} from '@/redux-actions/projects/projectsActions';
import { getProjectsUtil } from '@/utils/project/projectsListUtil';
import { setQueryPageParamsUtil } from '@/utils/routeUtils';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

function ProjectsWithFilters({
  location,
  projects,
  pageSettings,
  getProjectsInProcess,
  filtersSelected,
  filtersApplied,
  filterApplied,
  withDiscogsFilters,
  className,
  sortAndFilters,
  sortSelected,
  isFullType,
  withAnimation,
  projectsLength,
  previewType,
  userId,
  projectBlockClassName,
  secondOffset,
  withMarginBottomMinus,
  getProjects,
  loadedProjectsFromApi,
  loadSortAndFiltersInProcess,
  loadedSortAndFiltersFromApi,
  filterSelectAction,
  filterApplyAction,
  pageSettings: { size, currentNumber = 0 } = {},
  sortAndFilters: { filter: { filters = [] } = {}, sort: sorting = [] } = {},
  previewType: { activePreviewType } = {},
  querySearch,
  listWithPadding,
  sideBarLayoutClassName,
  customListPageBanner,
  children,
}) {
  const setQueryPageParams = useCallback(() => {
    if (
      location !== ProjectsLocationsConstants.NEW_ARRIVALS &&
      location !== ProjectsLocationsConstants.LATE_ENTRY &&
      location !== ProjectsLocationsConstants.FUNDING_NOW &&
      location !== ProjectsLocationsConstants.TRENDING
    ) {
      const sortQuery = getSortQueryUtil({ sortSelected });

      const commonFilters = getFilterQueryUtil({
        filters,
        filtersApplied,
      });

      const filtersQuery = querySearch
        ? {
            ...commonFilters,
            query: querySearch,
          }
        : commonFilters;

      setQueryPageParamsUtil({
        filtersQuery,
        sortQuery,
        pageSize: size,
        pageNumber: currentNumber,
      });
    }
  }, [currentNumber, filters, filtersApplied, location, querySearch, size, sortSelected]);

  useEffect(() => {
    setQueryPageParams();
  }, [setQueryPageParams]);

  useEffect(() => {
    if (!getProjectsInProcess) {
      setQueryPageParams();
    }
  }, [getProjectsInProcess, setQueryPageParams]);

  const onGetProjects = ({ search, isNowSending, withScroll = true, pageNumber, pageSize, updateSortAndFilters }) => {
    getProjectsUtil({
      location,
      getProjectsInProcess,
      userId,
      secondOffset,
      getProjects,

      search,
      isNowSending,
      withScroll,
      pageNumber,
      pageSize,
      updateSortAndFilters,
    }).then();
  };

  const changeFilter = ({
    categoryId,
    items,
    isNowSending = true,
    isApplyFilter = true,
    multi = true,
    withScroll = true,
    beforeResetCategory = false,
    beforeResetCategoryNow = false,
  }) => {
    filterSelectAction({
      location,
      categoryId,
      selected: items,
      multi,
      beforeResetCategory,
      beforeResetCategoryNow,
    });

    if (isNowSending) {
      if (isApplyFilter) {
        filterApplyAction(location);
      }

      onGetProjects({
        isNowSending,
        withScroll,
        pageNumber: 0,
        updateSortAndFilters: true,
      });
    }
  };

  const renderDiscogsFilters = () => {
    if (!withDiscogsFilters) {
      return null;
    }

    return (
      <SideBarLayout withMarginBottomMinus={withMarginBottomMinus} className={sideBarLayoutClassName}>
        <RetractableMenu buttonIcon={<FilterIcon />}>
          <DiscogsTypeFilters
            location={location}
            inProcess={(loadSortAndFiltersInProcess && !loadedSortAndFiltersFromApi) || !loadedSortAndFiltersFromApi}
            filtersSelected={filtersSelected}
            filtersApplied={filtersApplied}
            filterApplied={filterApplied}
            sortAndFilters={sortAndFilters}
            changeFilterCallBack={changeFilter}
            onGetProjects={onGetProjects}
          />
        </RetractableMenu>
        {!!customListPageBanner && (
          <DesktopLayout>
            <div className={styles.projectList__banner}>{customListPageBanner}</div>
          </DesktopLayout>
        )}
      </SideBarLayout>
    );
  };

  const renderProjectFilters = () => (
    <ProjectTypeFilters
      location={location}
      filtersSelected={filtersSelected}
      filtersApplied={filtersApplied}
      filterApplied={filterApplied}
      sortAndFilters={sortAndFilters}
      changeFilterCallBack={changeFilter}
      inProcess={(loadSortAndFiltersInProcess && !loadedSortAndFiltersFromApi) || !loadedSortAndFiltersFromApi}
    >
      <div className={styles.projectsList__projectSort}>
        <ProjectsSortBy
          className={styles.projectsList__projectSort__sortBy}
          location={location}
          sorting={sorting}
          sortSelected={sortSelected}
          sortCallback={() => onGetProjects({ isNowSending: true })}
        />
        {!!activePreviewType && (
          <DesktopLayout>
            <ProjectTypePreviewControl location={location} activePreviewType={activePreviewType} />
          </DesktopLayout>
        )}
      </div>
    </ProjectTypeFilters>
  );

  return (
    <Projects
      location={location}
      projects={projects}
      pageSettings={pageSettings}
      getProjectsInProcess={getProjectsInProcess}
      withDiscogsFilters={withDiscogsFilters}
      withFilters
      className={className}
      sortAndFilters={sortAndFilters}
      withSort
      withPageSize
      isFullType={isFullType}
      withAnimation={withAnimation}
      projectsLength={projectsLength}
      previewType={previewType}
      userId={userId}
      withPagination
      projectBlockClassName={projectBlockClassName}
      secondOffset={secondOffset}
      changeFilterCallBack={changeFilter}
      renderDiscogsFilters={renderDiscogsFilters}
      renderProjectFilters={renderProjectFilters}
      direction="row"
      listWithPadding={listWithPadding}
      loadedProjectsFromApi={loadedProjectsFromApi}
    >
      {children}
    </Projects>
  );
}

ProjectsWithFilters.defaultProps = {
  ...ProjectsProps,
};

ProjectsWithFilters.propTypes = {
  ...ProjectsTypes,
};

export default connect(
  (state) => ({
    sortAndFilters: state.ProjectsSortAndFiltersReducer.sortAndFilters,
    loadSortAndFiltersInProcess: state.ProjectsSortAndFiltersReducer.loadSortAndFiltersInProcess,
    loadedSortAndFiltersFromApi: state.ProjectsSortAndFiltersReducer.loadedSortAndFiltersFromApi,
  }),
  (dispatch) => ({
    filterSelectAction: (params) => {
      dispatch(selectProjectsFilterAction(params));
    },
    filterApplyAction: (location) => {
      dispatch(applyProjectsFilterAction(location));
    },
    getProjects: (params) => getProjectsRequestAction(params)(dispatch),
  })
)(ProjectsWithFilters);
