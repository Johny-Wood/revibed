import { useCallback, useEffect, useRef } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import InfinityScrollLayout from '@/components/layouts/InfinityScrollLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import ProjectsProps from '@/components/projects/_config/props';
import ProjectsTypes from '@/components/projects/_config/types';
import ProjectList from '@/components/projects/ProjectList';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsLocationsMapConstants } from '@/constants/projects/locationsMap';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { showVideoPlayerAction } from '@/redux-actions/components/videoPlayerActions';
import { getProjectsRequestAction } from '@/redux-actions/projects/projectsActions';
import NextRouter from '@/services/NextRouter';
import ScrollService from '@/services/scroll/ScrollService';
import { loadYTPlayerUtil } from '@/utils/player/videoPlayerUtils';
import { getProjectsUtil } from '@/utils/project/projectsListUtil';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function Projects({
  location,
  projects,
  pageSettings,
  getProjectsInProcess,
  loadedProjectsFromApi,
  withFilters,
  withDiscogsFilters,
  className,
  sortAndFilters,
  withSort,
  withPageSize,
  withRating,
  isFullType,
  infinityScroll,
  withAnimation,
  withReasons,
  projectsLength,
  previewType,
  userId,
  withPagination,
  projectBlockClassName,
  showVideoPlayer,
  secondOffset,
  getProjects,
  externalGetProjects,
  noResults,
  renderDiscogsFilters,
  renderProjectFilters,
  changeFilterCallBack,
  direction = 'column',
  listWithPadding = true,

  customItem,
}) {
  const projectsRef = useRef(null);

  const startYPlayerFromUrl = useCallback(() => {
    if (
      location === ProjectsLocationsConstants.TRENDING ||
      location === ProjectsLocationsConstants.NEW_ARRIVALS ||
      location === ProjectsLocationsConstants.LATE_ENTRY
    ) {
      return;
    }

    const { router: { router: { query: { player } = {} } = {} } = {} } = NextRouter.getInstance();

    const projectsWithYoutubeLinks = projects.filter(({ youtubeLink }) => youtubeLink);

    if (projectsWithYoutubeLinks.length > 0 && player === 'true') {
      const [firstProjectWithYoutubeLinks] = projectsWithYoutubeLinks;
      const { id: projectId } = firstProjectWithYoutubeLinks;

      loadYTPlayerUtil(() => {
        showVideoPlayer({
          location,
          playingId: projectId,
          playingProjectId: projectId,
          userId,
          autoPlay: true,
        });
      });
    }
  }, [location, projects, showVideoPlayer, userId]);

  useEffect(() => {
    const locationPathName = {
      ...ProjectsLocationsMapConstants,
      [ProjectsLocationsConstants.PROJECTS_USER]: parseReplaceTextUtil(RoutePathsConstants.USER_PROJECTS, userId),
    };

    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      `${ScrollBlockIdConstants.PROJECTS_BLOCK_ID}_${location}`,
      locationPathName[location],
      projectsRef
    );
  }, [location, userId]);

  useEffect(() => {
    startYPlayerFromUrl();
  }, [startYPlayerFromUrl]);

  const onGetProjects = ({ search, isNowSending, withScroll = true, pageNumber, pageSize, updateSortAndFilters }) => {
    getProjectsUtil({
      location,
      getProjectsInProcess,
      userId,
      secondOffset,
      getProjects: externalGetProjects || getProjects,

      search,
      isNowSending,
      withScroll,
      pageNumber,
      pageSize,
      updateSortAndFilters,
    }).then();
  };

  const changePage = ({ size, page, isNowSending = true, withScroll = true } = {}) => {
    onGetProjects({
      isNowSending,
      withScroll,
      pageNumber: page,
      pageSize: size,
    });
  };

  return (
    <SiteWrapperLayout
      withPadding={listWithPadding && withDiscogsFilters}
      className={classNames([styles.listWrapper, `list-wrapper_${location}`])}
      firstInPage={withDiscogsFilters}
    >
      <WrapperContainerLayout ref={projectsRef} direction={direction}>
        {!!renderDiscogsFilters && renderDiscogsFilters()}
        <InfinityScrollLayout
          isInProcess={loadedProjectsFromApi && getProjectsInProcess}
          pageSettings={pageSettings}
          request={externalGetProjects || getProjects}
          disabled={!infinityScroll}
          location={location}
          root=".mainScrollbarScroller"
          rootMargin="0px 0px 500px 0px"
        >
          <ProjectList
            className={className}
            projectBlockClassName={projectBlockClassName}
            projects={projects}
            location={location}
            getProjectsInProcess={(getProjectsInProcess && !infinityScroll) || (getProjectsInProcess && !loadedProjectsFromApi)}
            loadedProjectsFromApi={loadedProjectsFromApi}
            withRating={withRating}
            withFilters={withFilters}
            withPagination={withPagination}
            withPageSize={withPageSize}
            isFullType={isFullType}
            withDiscogsFilters={withDiscogsFilters}
            withSort={withSort}
            withAnimation={withAnimation || infinityScroll}
            projectsLength={projectsLength}
            sortAndFilters={sortAndFilters}
            previewType={previewType}
            pageSettings={pageSettings}
            userId={userId}
            renderProjectFilters={renderProjectFilters}
            changeFilterCallBack={changeFilterCallBack}
            changePage={changePage}
            customItem={customItem}
            withReasons={withReasons}
            noResults={noResults}
          />
        </InfinityScrollLayout>
      </WrapperContainerLayout>
    </SiteWrapperLayout>
  );
}

Projects.defaultProps = {
  ...ProjectsProps,
};

Projects.propTypes = {
  ...ProjectsTypes,
};

export default connect(
  (state) => ({
    sortAndFilters: state.ProjectsSortAndFiltersReducer.sortAndFilters,
  }),
  (dispatch) => ({
    getProjects: (params) => getProjectsRequestAction(params)(dispatch),
    showVideoPlayer: (params) => {
      dispatch(showVideoPlayerAction(params));
    },
  })
)(Projects);
