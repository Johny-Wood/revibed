import { useMemo } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ProjectPagination from '@/components/projects/pagination/ProjectPagination';
import DefaultProject from '@/components/projects/Project/DefaultProject';
import ProjectsListProps from '@/components/projects/ProjectList/_config/props';
import ProjectsListTypes from '@/components/projects/ProjectList/_config/types';
import ProjectsContainer from '@/components/projects/ProjectsContainer';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsPreviewTypesConstants } from '@/constants/projects/previewTypes';
import MyFeedEventTypes from '@/pages/main-projects/MainProjectsPageWrapper/_components/MyFeed/_components/MyFeedProjects/_components/MyFeedEventTypes';

import styles from './styles.module.scss';

const ITEMS_OPTIONS = [
  {
    id: 10,
    value: 10,
    label: '10',
  },
  {
    id: 25,
    value: 25,
    label: '25',
  },
  {
    id: 50,
    value: 50,
    label: '50',
  },
  {
    id: 100,
    value: 100,
    label: '100',
  },
];

function ProjectList({
  className,
  projects,
  location,
  changeFilterProps,
  changeFilterCallBack,
  sortAndFilters: { filter: { filters = {} } = {} },
  isFullType,
  projectsLength,
  previewType: { activePreviewType } = {},
  userId,
  withFilters,
  projectBlockClassName,
  withPagination,
  withPageSize,
  pageSettings: { size, totalPages, currentNumber, totalElements } = {},
  changePage,
  withDiscogsFilters,
  withSort,
  renderProjectFilters,
  getProjectsInProcess,
  loadedProjectsFromApi,
  withAnimation,
  withReasons,
  noResults,
  customItem: CustomItem,
  children,
}) {
  const isLocationLive = useMemo(
    () => location === ProjectsLocationsConstants.NEW_ARRIVALS || location === ProjectsLocationsConstants.LATE_ENTRY,
    [location]
  );

  const isLocationTrending = useMemo(() => location === ProjectsLocationsConstants.TRENDING, [location]);

  const isLiveType = useMemo(
    () =>
      activePreviewType === ProjectsPreviewTypesConstants.LIST ||
      location === ProjectsLocationsConstants.NEW_ARRIVALS ||
      location === ProjectsLocationsConstants.LATE_ENTRY ||
      isFullType,
    [isFullType, location, activePreviewType]
  );

  const classNameList = useMemo(
    () =>
      classNames(
        styles.projectList,
        activePreviewType === ProjectsPreviewTypesConstants.LIST || isLocationLive || isLocationTrending
          ? styles.projectList_direction_column
          : styles.projectList_direction_row
      ),
    [activePreviewType, isLocationLive, isLocationTrending]
  );

  const projectListForView = useMemo(() => {
    const projectsTmp = cloneDeep(projects);

    if (CustomItem) {
      projectsTmp.splice(2, 0, {
        id: 'custom-item',
        isCustomItem: true,
      });
    }

    return projectsTmp;
  }, [CustomItem, projects]);

  return (
    <div className={classNames([styles.projectsList, className])}>
      {children}
      {(withFilters || withSort) && (
        <div
          className={classNames(
            styles.projectsList__control,
            withDiscogsFilters && styles.projectsList__control_withDiscogsFilters
          )}
        >
          {!!renderProjectFilters && renderProjectFilters()}
        </div>
      )}
      <ProjectsContainer
        projects={projects}
        getProjectsInProcess={getProjectsInProcess}
        loadedProjectsFromApi={loadedProjectsFromApi}
        location={location}
        noResults={noResults}
      >
        <TransitionGroup className={classNameList}>
          {projectListForView.map((project) => {
            const { isCustomItem, reasons } = project;

            return (
              <CSSTransition
                key={`project-${project.id}`}
                classNames="fade-to-top-300-animation"
                timeout={{
                  appear: 0,
                  enter: withAnimation ? 300 : 0,
                  exit: withAnimation ? 300 : 0,
                }}
              >
                <div
                  className={classNames(
                    styles.projectBlock,
                    projectBlockClassName,
                    !isLiveType && styles.projectBlock_default,
                    isCustomItem && styles.projectBlock_custom
                  )}
                >
                  {withReasons && <MyFeedEventTypes types={reasons} />}
                  {!isCustomItem ? (
                    <DefaultProject
                      isLiveType={isLiveType}
                      userId={userId}
                      projectsCount={projectsLength || projects.length}
                      location={location}
                      changeFilterProps={changeFilterProps}
                      changeFilterCallBack={changeFilterCallBack}
                      project={project}
                      filters={filters}
                      isFullType={activePreviewType === ProjectsPreviewTypesConstants.LIST || isFullType}
                      withFilters={withFilters}
                      tagsWithFilter={location === ProjectsLocationsConstants.PROJECTS}
                    />
                  ) : (
                    <CustomItem />
                  )}
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </ProjectsContainer>
      <div className={styles.projectList__footer}>
        {withPagination && (
          <ProjectPagination
            location={location}
            currentNumber={currentNumber}
            size={size}
            totalPages={totalPages}
            totalElements={totalElements}
            onLoadRequest={changePage}
            withPageSize={withPageSize}
            itemsPerPage={ITEMS_OPTIONS}
          />
        )}
      </div>
    </div>
  );
}

ProjectList.defaultProps = {
  ...ProjectsListProps,
};

ProjectList.propTypes = {
  ...ProjectsListTypes,
};

export default ProjectList;
