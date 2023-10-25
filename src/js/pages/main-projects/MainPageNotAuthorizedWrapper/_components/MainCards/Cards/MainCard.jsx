import { useMemo } from 'react';

import classNames from 'classnames';

import DateInfo from '@/components/common/date/DateInfo';
import UpdatedDate from '@/components/common/date/UpdatedDate';
import PlayerPlayPauseButton from '@/components/player/control/PlayerPlayPauseButton';
import ProjectContributorInfo from '@/components/projects/Project/_components/ProjectContributorInfo';
import ProjectCover from '@/components/projects/Project/_components/ProjectCover';
import ProjectNames from '@/components/projects/Project/_components/ProjectNames';
import SecuredLabel from '@/components/projects/Project/_components/SecuredLabel';
import { CommonHeadConstants } from '@/constants/common/head';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import UserNotificationsTargetTpeConstants from '@/constants/user-notifications/targetType';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { createGoodsUrlUtil } from '@/utils/project/goodsUrlUtil';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

import styles from './styles.module.scss';

function MainCard({
  id,
  eventType,
  targetType,
  target: {
    id: targetId,
    secured: targetSecured,
    backgroundColor,
    title,
    name,
    albumTitle = name,
    artists,
    covers,
    youtubeLink,
    tracks = [],
  } = {},
  to: {
    tracksCount,
    albumsCount,
    cutsCount = tracksCount || albumsCount,
    firstCut,
    collected,
    leftTimeBeforeClosing,
    status: { name: statusName } = {},
    userId: userIdFromTo,
    avatar: avatarFromTo,
    country: countryFromTo,
    userName: userNameFromTo,
  } = {},
  owner: { id: userId, avatar, country, name: userName } = {},
  date,
  itemRestProps: { playList: itemPlaylist = () => [] } = {},
  itemInnerProps: {
    playButton: { activePlayingItemId, isPlaying, playingTime, playList, onClickPlay, ...playButtonProps } = {},
  } = {},
}) {
  const { isNotDesktop } = ViewportHook();

  const typeProject = targetType === UserNotificationsTargetTpeConstants.PROJECT;

  const eventUserId = useMemo(() => (typeProject ? userIdFromTo : userId), [typeProject, userId, userIdFromTo]);
  const eventAvatar = useMemo(() => (typeProject ? avatarFromTo : avatar), [typeProject, avatar, avatarFromTo]);
  const eventCountry = useMemo(() => (typeProject ? countryFromTo : country), [typeProject, country, countryFromTo]);
  const eventUserName = useMemo(() => (typeProject ? userNameFromTo : userName), [typeProject, userName, userNameFromTo]);

  const recommended = eventType === ProjectBaseInfoConstants.PROJECT_PROMOTION;
  const secured = eventType === ProjectEventsConstants.PROJECT_MEDIA_SECURED;
  const newCut = eventType === ProjectEventsConstants.PROJECT_NEW_CUT;



  const href = useMemo(() => (!typeProject ? createGoodsUrlUtil(targetId) : undefined), [targetId, typeProject]);

  return (
    <div className={styles.MainCard}>
      <ProjectCover
        className={styles.projectCover}
        containerClassName={styles.projectCoverContainer}
        covers={covers}
        projectId={targetId}
        withPlayVideo
        withPlayDisabled={!youtubeLink && tracks.length === 0}
        playButton={
          tracks.length > 0
            ? {
                component: PlayerPlayPauseButton,
                playList,
                isPlaying: isPlaying && id === activePlayingItemId,
                playingTime: id === activePlayingItemId ? playingTime : 0,
                onClickPlay: () => {
                  if (itemPlaylist(id).length === 0) {
                    return;
                  }

                  const { id: itemPlaylistId, src: itemPlaylistSrc } = itemPlaylist(id)[0];

                  onClickPlay({ id: itemPlaylistId, src: itemPlaylistSrc }, id);
                },
                ...playButtonProps,
              }
            : undefined
        }
        projectInfo={{
          id,
          projectId: targetId,
          albumTitle,
          artists,
          title,
        }}
        title={title}
        location={ProjectsLocationsConstants.FUNDING_NOW}
        size={isNotDesktop ? 145 : 155}
        loading="eager"
        href={href}
      >
        {(targetSecured || secured) && <SecuredLabel withDescription={false} />}
      </ProjectCover>
      <ProjectNames
        className={styles.projectNames}
        titleClassName={styles.projectNames__project__title}
        albumClassName={styles.projectNames__project__album__title}
        projectId={targetId}
        title={title}
        artists={artists}
        albumTitle={albumTitle}
        isRoute
        href={href}
      />
    </div>
  );
}

export default MainCard;
