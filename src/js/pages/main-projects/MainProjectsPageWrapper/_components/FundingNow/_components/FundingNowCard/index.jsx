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

function FundingNowCard({
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

  const dateEnd = useMemo(
    () => (!recommended && !secured ? date : leftTimeBeforeClosing),
    [recommended, secured, date, leftTimeBeforeClosing]
  );

  const isLeftDateLastCall = useMemo(() => dateEnd && projectsStatusesUtil.isLastCallStatus(statusName), [dateEnd, statusName]);

  const href = useMemo(() => (!typeProject ? createGoodsUrlUtil(targetId) : undefined), [targetId, typeProject]);

  return (
    <div
      className={classNames(
        styles.fundingNowCard,
        recommended && styles.fundingNowCard_recommended,
        secured && styles.fundingNowCard_secured
      )}
      style={!secured ? { backgroundColor } : {}}
    >
      <div className={styles.fundingNowCardContainer}>
        <ProjectContributorInfo
          className={styles.projectRoleInfo}
          nameClassName={styles.projectRoleInfo__name}
          boughtClassName={styles.projectRoleInfo__bought}
          contributorDescriptionClassName={styles.projectRoleInfo__contributorDescription}
          paramsClassName={styles.projectRoleInfo__params}
          userAvatarClassName={styles.userAvatar}
          classNameNickName={styles.nickname__name}
          flagClassName={styles.nickname__name__flag}
          contributor={{
            id: eventUserId,
            country: eventCountry,
            avatar: eventAvatar,
            name: !recommended && !secured ? eventUserName : CommonHeadConstants.SITE_NAME,
            cutsCount,
            firstCut,
          }}
          avatar={{
            size: 30,
            kollektivxAvatar: recommended || secured,
            backgroundColor: recommended || secured ? 'black' : undefined,
          }}
          withDescription={false}
          isRoute={!recommended && !secured}
          withDescriptionRole={false}
          withInfoDetails={false}
          withBought={!recommended && !secured}
          bought={cutsCount}
          contributorDescription={recommended ? 'recommends project' : secured ? 'secured project' : ''}
          boughtType={albumsCount > 0 ? ['album', 'albums'] : tracksCount > 0 ? ['track', 'tracks'] : ['pre-order', 'pre-orders']}
          boughtDescription={newCut ? 'joined' : undefined}
          boughtShownCount={tracksCount > 0}
        />
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
        <div className={styles.fundingNowCard__details}>
          <div className={classNames([`c-${isLeftDateLastCall && (recommended || secured) ? 'last-call' : 'gray-2'}`])}>
            {!recommended && !secured && (
              <UpdatedDate
                className={styles.fundingNowCard__date}
                date={date}
                direction="AGO"
                withIcon={false}
                withDescriptions={false}
              />
            )}
            {(recommended || secured) && leftTimeBeforeClosing && (
              <DateInfo
                className={styles.fundingNowCard__date}
                date={date}
                leftDate={leftTimeBeforeClosing}
                withCurrentDatePoint
                direction="LEFT"
                withDescriptions
              />
            )}
          </div>
          {!!collected && (
            <div
              className={classNames([
                styles.fundingNowCardUpTo,
                statusName === 'OPEN' && styles.fundingNowCardUpTo_OPEN,
                (statusName === 'LAST_CALL' || statusName === 'IN_TRANSIT') && styles.fundingNowCardUpTo_LAST_CALL,
              ])}
            >
              {!recommended && !secured && (
                <span className="m-right-3">
                  {statusName ? <span className={styles.fundingNowCardUpTo__triangle} /> : <span>up to </span>}
                </span>
              )}
              <b>{collected}%</b>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FundingNowCard;
