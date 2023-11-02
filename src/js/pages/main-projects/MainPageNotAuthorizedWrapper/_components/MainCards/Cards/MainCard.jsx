import { useMemo } from 'react';

import PlayerPlayPauseButton from '@/components/player/control/PlayerPlayPauseButton';
import ProjectCover from '@/components/projects/Project/_components/ProjectCover';
import ProjectNames from '@/components/projects/Project/_components/ProjectNames';
import SecuredLabel from '@/components/projects/Project/_components/SecuredLabel';
import { ProjectEventsConstants } from '@/constants/projects/events';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import UserNotificationsTargetTpeConstants from '@/constants/user-notifications/targetType';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { createGoodsUrlUtil } from '@/utils/project/goodsUrlUtil';

import styles from './styles.module.scss';

function MainCard({
  id,
  eventType,
  targetType,
  target: {
    id: targetId,
    secured: targetSecured,
    title,
    name,
    albumTitle = name,
    artists,
    covers,
    youtubeLink,
    tracks = [],
  } = {},
  itemRestProps: { playList: itemPlaylist = () => [] } = {},
  itemInnerProps: {
    playButton: { activePlayingItemId, isPlaying, playingTime, playList, onClickPlay, ...playButtonProps } = {},
  } = {},
}) {
  const { isNotDesktop } = ViewportHook();

  const typeProject = targetType === UserNotificationsTargetTpeConstants.PROJECT;
  const secured = eventType === ProjectEventsConstants.PROJECT_MEDIA_SECURED;

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
