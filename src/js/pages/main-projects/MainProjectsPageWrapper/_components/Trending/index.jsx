import { useEffect, useRef } from 'react';

import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';

import ToProjectsLink from '@/components/common-ui/links/ToProjectsLink';
import NoResults from '@/components/common/NoResults';
import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import ProjectContributorCount from '@/components/projects/Project/_components/ProjectContributorCount';
import ProjectCover from '@/components/projects/Project/_components/ProjectCover';
import ProjectNames from '@/components/projects/Project/_components/ProjectNames';
import ProjectProcess from '@/components/projects/Project/_components/ProjectProcess';
import ProjectRating from '@/components/projects/Project/_components/ProjectRating';
import ProjectTime from '@/components/projects/Project/_components/ProjectTime';
import Preloader from '@/components/ui/Preloader';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ScrollService from '@/services/scroll/ScrollService';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

import styles from './styles.module.scss';

function Trending({ projectsInfo, trendingInfo, getTrendingListInProcess }) {
  const trendingRef = useRef(null);

  const { isTablet } = ViewportHook();

  const projects = orderBy(trendingInfo, ['currentPosition'], ['asc']).map(
    ({ currentPosition, projectId, isNew, lastPosition }) => ({
      currentPosition,
      lastPosition,
      isNew,
      ...(projectsInfo.find((project) => project.id === projectId) || {}),
    })
  );

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
      `${ScrollBlockIdConstants.PROJECTS_BLOCK_ID}_${ProjectsLocationsConstants.TRENDING}`,
      RoutePathsConstants.MAIN,
      trendingRef
    );
  }, []);

  return (
    <div className={styles.Trending} ref={trendingRef}>
      <SecondaryTitle title={TitlesConstants.PRE_ORDERS} />
      <div className={styles.Trending__content}>
        <div className={styles.Trending__items}>
          {projects.length > 0
            ? projects.map(
                ({
                  id,
                  currentPosition,
                  covers,
                  title,
                  artists,
                  status: { name: statusName = {} } = {},
                  albumTitle,
                  cutsCount,
                  totalCutsCount,
                  startDate,
                  closeDate,
                }) => {
                  const isLastCallStatus = projectsStatusesUtil.isLastCallStatus(statusName);
                  const isOpenStatus = projectsStatusesUtil.isOpenStatus(statusName);

                  return (
                    <div key={`Trending-item-${id}`} className={styles.Trending__item}>
                      <ProjectCover
                        className={styles.Trending__projectCover}
                        containerClassName={styles.Trending__projectCoverContainer}
                        covers={covers}
                        projectId={id}
                        withPlayVideo
                        location={ProjectsLocationsConstants.TRENDING}
                        size={85}
                        projectInfo={{
                          id,
                          projectId: id,
                          artists,
                          title,
                          albumTitle,
                        }}
                        title={title}
                        loading="eager"
                      >
                        <ProjectRating currentPosition={currentPosition} />
                      </ProjectCover>
                      <div className={styles.Trending__info}>
                        <ProjectNames
                          projectId={id}
                          title={title}
                          artists={artists}
                          albumTitle={albumTitle}
                          isRoute
                          className={styles.Trending__projectNames}
                          titleClassName={styles.Trending__projectNames__title}
                          albumClassName={styles.Trending__projectNames__album__title}
                        />
                        <ProjectProcess
                          cutsCount={cutsCount}
                          totalCutsCount={totalCutsCount}
                          statusName={statusName}
                          className={styles.Trending__projectProcess}
                        />
                        <div className={styles.Trending__footer}>
                          <ProjectContributorCount
                            totalCount={totalCutsCount}
                            cutsCount={cutsCount}
                            withDescription={isTablet}
                            className={styles.Trending__projectCount}
                          />
                          <ProjectTime
                            withIcon={false}
                            isLastCallStatus={isLastCallStatus}
                            isOpenStatus={isOpenStatus}
                            startDate={startDate}
                            closeDate={closeDate}
                            className={styles.Trending__projectTime}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            : !getTrendingListInProcess && <NoResults minPaddings />}
        </div>
        <Preloader isShown={getTrendingListInProcess} withOffsets={false} opacity={1} withBgColor />
      </div>
      <ToProjectsLink />
    </div>
  );
}

export default connect((state) => ({
  projectsInfo: state.TrendingReducer.projects,
  trendingInfo: state.TrendingReducer.trendingInfo,
  getTrendingListInProcess: state.TrendingReducer.getTrendingListInProcess,
}))(Trending);
