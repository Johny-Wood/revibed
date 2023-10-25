import { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import NotificationCount from '@/components/common/Notification/NotificationCount';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import ProjectFooterControl from '@/components/project/_components/ProjectFooterControl';
import ProjectCardAbout from '@/components/project/ProjectCard/info-details/ProjectCardAbout';
import ProjectContributorCount from '@/components/projects/Project/_components/ProjectContributorCount';
import ProjectCover from '@/components/projects/Project/_components/ProjectCover';
import ProjectNames from '@/components/projects/Project/_components/ProjectNames';
import ProjectProcess from '@/components/projects/Project/_components/ProjectProcess';
import ProjectRating from '@/components/projects/Project/_components/ProjectRating';
import ProjectShareButton from '@/components/projects/Project/_components/ProjectShareButton';
import ProjectStatus from '@/components/projects/Project/_components/ProjectStatus';
import ProjectTags from '@/components/projects/Project/_components/ProjectTags';
import ProjectTime from '@/components/projects/Project/_components/ProjectTime';
import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';

import styles from './styles.module.scss';

function DefaultProject({
  isLiveType,
  withRating,
  isFullType,
  location,
  tagsShowAll,
  project: {
    backgroundColor,
    isNew,
    currentPosition,
    lastPosition,
    covers = [],
    status = {},
    status: { name: statusName = {} } = {},
    id: projectId,
    targetId,
    artists,
    title,
    albumTitle,
    youtubeLink,
    founder,
    description,
    tags = [],
    startDate,
    closeDate,
    cutsCount,
    totalCutsCount,
  } = {},
  project: projectInfo,
  withFilters,
  filters: { STATUS: { data: { items = [] } = {} } = {} } = {},
  tagsWithFilter,
  changeFilterCallBack,
  filters = {},
  userIsAuthorized,
  userId,
  target,
  unreadEvents = [],
  variablesList: { UNREAD_MARKER_PROJECTS_ENABLED } = {},
  userInfo: { createProjectsDisabled } = {},
  showPopup,
  withStatus = true,
  withBuyButtons = true,
  withFooterInfo = true,
  withFooter = true,
  withShare = true,
  withFounder,
  founderClassName,
  showMoreClassName,
  className,
  coverClassName,
  coverContainerClassName,
  namesClassName,
  namesTitlesClassName,
  headerClassName,
  withPlayVideo = true,
  founderProps: { avatarSize = 38, sliceLength: founderSliceLength, withShowMore } = {},
}) {
  const { isNotDesktop } = ViewportHook();

  const isOpenStatus = projectsStatusesUtil.isOpenStatus(statusName);
  const isLastCallStatus = projectsStatusesUtil.isLastCallStatus(statusName);
  const isLegacyStatus = projectsStatusesUtil.isLegacyStatus(statusName);
  const isDraftStatus = projectsStatusesUtil.isDraftStatus(statusName);
  const isRejectedStatus = projectsStatusesUtil.isRejectedStatus(statusName);

  const isLiveLocation = useMemo(
    () =>
      location === ProjectsLocationsConstants.NEW_ARRIVALS ||
      location === ProjectsLocationsConstants.LATE_ENTRY ||
      location === ProjectsLocationsConstants.MY_FEED,
    [location]
  );

  const canBeLateEntryStatus = useMemo(
    () => projectsStatusesUtil.canBeLateEntryStatus(projectInfo, { userIsAuthorized }),
    [projectInfo, userIsAuthorized]
  );

  const draftControlDisabled = useMemo(() => projectsStatusesUtil.isInModerationStatus(statusName), [statusName]);

  const renderProjectNotification = useCallback(
    ({ withCount = true, isInCover } = {}) => {
      if (
        !UNREAD_MARKER_PROJECTS_ENABLED &&
        location !== ProjectsLocationsConstants.NEW_ARRIVALS &&
        location !== ProjectsLocationsConstants.MY_FEED
      ) {
        return null;
      }

      const unreadEventsObj = unreadEvents[0];
      let currentLocationProjectsEvents = {};
      let currentLocationProjectEventCount = 0;

      if (unreadEventsObj) {
        currentLocationProjectsEvents = unreadEventsObj[location] || {};
        currentLocationProjectEventCount = currentLocationProjectsEvents[targetId || projectId] || 0;
      }

      return (
        <NotificationCount
          className={classNames([isInCover ? styles.notificationCount : styles.notificationCount])}
          withCount={withCount}
          count={currentLocationProjectEventCount}
        />
      );
    },
    [UNREAD_MARKER_PROJECTS_ENABLED, location, projectId, targetId, unreadEvents]
  );

  const renderProjectTags = useCallback(
    () => (
      <ProjectTags
        showAll={tagsShowAll}
        className={styles.projectTags}
        withFilter={tagsWithFilter}
        tags={tags}
        filters={filters}
        projectId={projectId}
        changeFilterCallBack={changeFilterCallBack}
      />
    ),
    [changeFilterCallBack, filters, projectId, tags, tagsShowAll, tagsWithFilter]
  );

  const renderFounderDescription = useCallback(
    ({ sliceLength }) => {
      if (!isLiveLocation && !isFullType && !isNotDesktop && !withFounder) {
        return null;
      }

      return (
        <ProjectCardAbout
          className={classNames(styles.projectCardAbout, founderClassName)}
          showMoreClass={classNames(styles.projectCardAbout__showMore, showMoreClassName)}
          contributorClassName={classNames(styles.projectCardAbout__contributor)}
          widthContentTitle={false}
          description={description}
          contributor={founder}
          avatarSize={avatarSize}
          sliceLength={sliceLength}
          withShowMore={withShowMore}
        />
      );
    },
    [
      avatarSize,
      description,
      founder,
      founderClassName,
      isFullType,
      isLiveLocation,
      isNotDesktop,
      showMoreClassName,
      withFounder,
      withShowMore,
    ]
  );

  const renderProjectHeader = useCallback(
    () => (
      <div className={classNames(styles.projectHeader, headerClassName)}>
        {(withStatus || withBuyButtons) && (
          <div className={styles.projectJoin}>
            {withStatus && (
              <ProjectStatus
                changeFilterCallBack={changeFilterCallBack}
                filters={items}
                withFilter={withFilters}
                projectInfo={projectInfo}
              />
            )}
          </div>
        )}
        <ProjectNames
          className={classNames(styles.projectNames, namesClassName)}
          titlesClassName={classNames(styles.projectNamesTitles, namesTitlesClassName)}
          projectId={projectId}
          title={title}
          artists={artists}
          albumTitle={albumTitle}
          isRoute
          isInline={isLiveLocation || isFullType}
        />
        <DesktopLayout>{renderProjectTags()}</DesktopLayout>
      </div>
    ),
    [
      albumTitle,
      artists,
      changeFilterCallBack,
      headerClassName,
      isFullType,
      isLiveLocation,
      items,
      namesClassName,
      namesTitlesClassName,
      projectId,
      projectInfo,
      renderProjectTags,
      title,
      withBuyButtons,
      withFilters,
      withStatus,
    ]
  );

  const renderProjectFooter = useCallback(
    () => (
      <div className={styles.projectFooter}>
        <MobileLayout>{renderProjectTags()}</MobileLayout>
        {withFooter && (
          <>
            <div className={classNames([styles.projectCuts, 'w-100pct f-y-center', isLegacyStatus && 'o-50'])}>
              <ProjectContributorCount
                totalCount={totalCutsCount}
                cutsCount={cutsCount}
                className={classNames([styles.projectContributorCount, isLegacyStatus && 'o-50'])}
                valueClassName={styles.projectContributorCount__value}
              />
              <div className={styles.projectStatusInformation}>
                <ProjectTime
                  leftTimeClassName={styles.projectLeftTime}
                  isLastCallStatus={isLastCallStatus}
                  isOpenStatus={isOpenStatus}
                  startDate={startDate}
                  closeDate={closeDate}
                  withDescriptions={
                    (!isNotDesktop && (isLiveLocation || isFullType || (closeDate > 0 && !isLegacyStatus))) ||
                    (isNotDesktop && closeDate > 0)
                  }
                />
              </div>
            </div>
            <ProjectProcess cutsCount={cutsCount} totalCutsCount={totalCutsCount} statusName={statusName} />
            {withFooterInfo && (
              <div className={styles.projectFooter__info}>
                <div className="f-y-center f-x-end f-grow-1">
                  <ProjectFooterControl
                    projectInfo={projectInfo}
                    canBeLateEntryStatus={canBeLateEntryStatus}
                    cutSizeClassName={styles.projectCutSize}
                  />
                </div>
                <TransitionSwitchLayout isShown={isDraftStatus || isRejectedStatus}>
                  <div className={styles.projectDraftControl}>
                    <LinkRoute
                      href={`${RoutePathsConstants[`${location}_EDIT`]}/${projectId}`}
                      className={styles.projectDraftControl__buttonEditDraft}
                      type="button_string"
                      text="edit draft"
                      disabled={draftControlDisabled}
                      onClick={(e) => {
                        if (draftControlDisabled) {
                          return;
                        }

                        if (createProjectsDisabled) {
                          e.preventDefault();

                          showPopup(PopupProjectIdsConstants.CreateProjectsDisabledPopup, {
                            typeAction: 'edit',
                          });
                        }
                      }}
                    />
                    <Button
                      type="button_string"
                      text="delete draft"
                      disabled={draftControlDisabled}
                      onClick={() => {
                        if (draftControlDisabled) {
                          return;
                        }
                        showPopup(PopupProjectIdsConstants.DeleteDraftProjectPopup, {
                          projectId,
                          location,
                        });
                      }}
                    />
                  </div>
                </TransitionSwitchLayout>
              </div>
            )}
          </>
        )}
      </div>
    ),
    [
      canBeLateEntryStatus,
      closeDate,
      createProjectsDisabled,
      cutsCount,
      draftControlDisabled,
      isDraftStatus,
      isFullType,
      isLastCallStatus,
      isLegacyStatus,
      isLiveLocation,
      isNotDesktop,
      isOpenStatus,
      isRejectedStatus,
      location,
      projectId,
      projectInfo,
      renderProjectTags,
      showPopup,
      startDate,
      statusName,
      totalCutsCount,
      withFooter,
      withFooterInfo,
    ]
  );

  return (
    <div
      className={classNames(
        styles.project,
        isLiveType ? styles.project_live : styles.project_default,
        (projectsStatusesUtil.isDraftStatus(statusName) || projectsStatusesUtil.isRejectedStatus(statusName)) &&
          styles.project_draft,
        className
      )}
      style={{
        backgroundColor,
      }}
    >
      {withRating && (
        <ProjectRating
          isNew={isNew}
          number={currentPosition}
          step={lastPosition && (lastPosition ? Math.abs(currentPosition - lastPosition) : 0)}
          direction={lastPosition && (currentPosition - lastPosition < 0 ? 'UP' : 'DOWN')}
        />
      )}
      <div className={styles.projectIntro}>
        {(isLiveLocation || isFullType || isNotDesktop) && withShare && (
          <ProjectShareButton
            className={styles.project__buttonShare}
            status={status}
            path={createProjectUrlUtil(projectId, title)}
            withText={!isNotDesktop}
          />
        )}
        {(location === ProjectsLocationsConstants.NEW_ARRIVALS || location === ProjectsLocationsConstants.MY_FEED) &&
          renderProjectNotification({ withCount: false })}
      </div>
      {renderFounderDescription({
        sliceLength: founderSliceLength || (isNotDesktop ? 74 : 170),
      })}
      <div className={styles.projectContentBlock}>
        <ProjectCover
          className={classNames(styles.projectCover, coverClassName)}
          containerClassName={classNames(styles.projectCoverContainer, coverContainerClassName)}
          userId={userId}
          target={target}
          covers={covers}
          projectId={projectId}
          projectInfo={{
            id: targetId || projectId,
            projectId,
            artists,
            title,
            albumTitle,
          }}
          title={title}
          withPlayVideo={withPlayVideo}
          withPlayDisabled={!youtubeLink}
          location={location}
          size={isNotDesktop || isLiveLocation ? 110 : 240}
        >
          {location !== ProjectsLocationsConstants.NEW_ARRIVALS &&
            location !== ProjectsLocationsConstants.MY_FEED &&
            renderProjectNotification({ isInCover: true })}
        </ProjectCover>
        <DesktopLayout>
          <div className={styles.projectInfo}>
            {renderProjectHeader()}
            {renderProjectFooter()}
          </div>
        </DesktopLayout>
        <MobileLayout>
          {renderProjectHeader()}
          {renderProjectFooter()}
        </MobileLayout>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(DefaultProject);
