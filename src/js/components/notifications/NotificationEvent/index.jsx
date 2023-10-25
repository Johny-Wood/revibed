import { useEffect, useRef } from 'react';

import classNames from 'classnames';

import NormalizeDate from '@/components/common/NormalizeDate';
import EventMarker from '@/components/events/EventMarker';
import NotificationEventType from '@/components/notifications/NotificationEvent/_components/NotificationEventType';
import UserAvatar from '@/components/user/UserAvatar';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ScrollService from '@/services/scroll/ScrollService';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';

import styles from './styles.module.scss';

function NotificationEvent({
  isUnreadEvent,
  typeContent,
  event,
  event: { id, eventType, date, title } = {},
  user: { id: ownerId, userId = ownerId, avatar } = {},
  withoutDate,
  dateType,
  active,
  canScrollToEvent,
  setCanScrollToEvent,
  avatarConfig: {
    shown: avatarShown = true,
    backgroundColor: avatarBackgroundColor,
    size: avatarSize,
    isRoute: avatarIsRoute,
    isSystemGem: avatarIsSystemGem,
    isSystemGoldenCoin: avatarIsSystemGoldenCoin,
    isSystemCoin: avatarIsSystemCoin,
    iconSize: avatarIconSize,
    iconColor: avatarIconColor,
  } = {},
  children,
  className,
  eventClassName,
  wrapperClassName,
  eventMarkerClassName,
}) {
  const eventRef = useRef(null);

  useEffect(() => {
    if (active && canScrollToEvent) {
      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
        `${ScrollBlockIdConstants.PROJECT_EVENT_ID}-${id}`,
        createProjectUrlUtil(id, title),
        eventRef
      );

      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
        .scrollToElement({
          sectionId: `${ScrollBlockIdConstants.PROJECT_EVENT_ID}-${id}`,
          inRoute: true,
          secondOffset: 300,
        })
        .then(() => {
          setCanScrollToEvent();
        });
    }
  }, [active, canScrollToEvent, id, setCanScrollToEvent, title]);

  return (
    <span ref={eventRef} className={classNames([styles.notificationEvent, active && styles.notificationEvent_active, className])}>
      {avatarShown && (
        <UserAvatar
          backgroundColor={avatarBackgroundColor}
          size={avatarSize}
          iconColor={avatarIconColor}
          iconSize={avatarIconSize}
          src={avatar}
          isSystemCoin={avatarIsSystemCoin}
          isSystemGem={avatarIsSystemGem}
          isSystemGoldenCoin={avatarIsSystemGoldenCoin}
          kollektivxAvatar={
            !avatar &&
            eventType !== ProjectEventsConstants.PROJECT_NEW_CUT &&
            eventType !== ProjectBaseInfoConstants.PROJECT_NEW_COMMENT
          }
          isRoute={!!avatar && avatarIsRoute}
          userId={userId}
        />
      )}
      <span className={classNames(styles.notificationEvent__wrapper, wrapperClassName)}>
        <span className={classNames(styles.notificationEvent__content)}>
          <NotificationEventType eventClassName={eventClassName} event={event} typeContent={typeContent} />
          {!withoutDate && (
            <NormalizeDate className={classNames(styles.notificationEvent__date, 'c-gray-2')} date={date} type={dateType} />
          )}
          <EventMarker className={eventMarkerClassName} shown={isUnreadEvent} />
        </span>
      </span>
      {children}
    </span>
  );
}

export default NotificationEvent;
