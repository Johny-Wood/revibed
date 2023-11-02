import { useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';
import { connect } from 'react-redux';

import Cover from '@/components/common/Cover';
import EmojiReplaceWrapper from '@/components/common/emoji/EmojiReplaceWrapper';
import FileUploaderList from '@/components/common/FileUploader/_components/FileUploaderList';
import ParseComponent from '@/components/common/ParseComponent';
import NotificationEvent from '@/components/notifications/NotificationEvent';
import ProjectRippedLabel from '@/components/projects/Project/_components/ProjectRippedLabel';
import SecuredLabel from '@/components/projects/Project/_components/SecuredLabel';
import LinkRoute from '@/components/ui/links/LinkRoute';
import NickName from '@/components/user/NickName';
import DialogEventsConstants from '@/constants/dialog/events';
import FollowEventsConstants from '@/constants/follow/events';
import MarketplaceEvents from '@/constants/marketplace/events';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import PromotionEventsConstants from '@/constants/promotion/events';
import { RoutePathsConstants } from '@/constants/routes/routes';
import UserNotificationsTargetTpeConstants from '@/constants/user-notifications/targetType';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';
import { parseReplaceTextUtil, splitTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const typeContent = ({ to, owner, t }) => {
  const { name: ownerUserName, id: ownerUserId, country: ownerCountry = {} } = owner || {};

  const {
    type,
    name,
    text,
    attachments,
    deleted,
    userName = ownerUserName,
    userId = ownerUserId,
    country: { title_en: titleEn, alias } = ownerCountry,
  } = to || {};

  return {
    [ProjectBaseInfoConstants.PROJECT_REJECTED]: {
      title: 'Pre-order refused',
    },
    [ProjectEventsConstants.PROJECT_RECORD_ON_THE_WAY]: {
      title: "The record is on it's way!",
    },
    [ProjectEventsConstants.PROJECT_MEDIA_PURCHASED]: {
      title: 'Media purchased',
    },
    [ProjectEventsConstants.PROJECT_PUBLISHED]: {
      title: 'Pre-order published',
    },
    [ProjectBaseInfoConstants.PROJECT_CREATED]: {
      title: 'Pre-order published',
    },
    [ProjectEventsConstants.PROJECT_NEW_CUT]: {
      children: (
        <>
          <NickName name={userName} userId={userId} country={titleEn} alias={alias} fontWeight="bold" />
          <br />
          <span className="t-size_13">pre-ordered this release</span>
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_MEDIA_SECURED]: {
      title: 'Pre-order secured',
    },
    [ProjectEventsConstants.PROJECT_FOUND_COMPLETED]: {
      title: 'Pre-order funded',
    },
    [ProjectBaseInfoConstants.PROJECT_STATUS_CHANGED]: {
      children: (
        <b>
          Pre-order status:&nbsp;
          <span style={{ color: `var(--color__${name})` }}>{t(name)}</span>
        </b>
      ),
    },
    [ProjectEventsConstants.PROJECT_STATUS_ARRIVED]: {
      children: (
        <b>
          Pre-order status:&nbsp;
          <span style={{ color: `var(--color__${name})` }}>{t(name)}</span>
        </b>
      ),
    },
    [ProjectEventsConstants.PROJECT_STATUS_LAST_CALL]: {
      children: (
        <b>
          Pre-order status:&nbsp;
          <span style={{ color: `var(--color__${name})` }}>{t(name)}</span>
        </b>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_DECLARED_REAL_CONDITIONS_DIFFERENCE]: {
      title: 'Record received, not as described',
    },
    [ProjectEventsConstants.PROJECT_VOTING_ADDED]: {
      title: 'Voting started',
    },
    [ProjectEventsConstants.PROJECT_LINK_EMAIL_SENT]: {
      title: <>Archive copy is&nbsp;ready!</>,
    },
    [ProjectEventsConstants.PROJECT_ADMIN_HAND_EVENT]: {
      className: 'notification-event__event_admin_hand',
      title: 'New system message',
      children: (
        <div className="t-size_13">
          <ParseComponent text={typeof to === 'string' ? `"${splitTextUtil(to, 35).introText}"` : ''} />
        </div>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_MEDIA_SOLD_OUT]: {
      title: 'Record sold!',
    },
    [ProjectBaseInfoConstants.PROJECT_BALANCE_ALLOCATED]: {
      text: (
        <span className="t-size_13">
          {type === 'INTERMEDIATE' ? (
            <>
              Extra funds after purchase and digitization have been distributed among contributors based on&nbsp;their
              contribution
            </>
          ) : (
            <>Funds have been distributed among contributors based on&nbsp;their contribution</>
          )}
        </span>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_NEW_COMMENT]: {
      children: (
        <>
          <NickName name={userName} userId={userId} country={titleEn} alias={alias} fontWeight="bold" />
          <br />
          {!deleted ? (
            <div className="t-size_13">
              commented:&nbsp;
              <EmojiReplaceWrapper
                text={!!text && typeof text === 'string' ? `"${splitTextUtil(text, 30).introText}"&nbsp;` : ''}
              />
              <FileUploaderList
                className={styles.uploadList}
                itemClassName={styles.uploadList__item}
                imageClassName={styles.uploadList__image}
                files={attachments}
                inline
                readOnly
                withLiteBox={false}
              />
            </div>
          ) : (
            <span className="t-size_13 c-red">comment deleted</span>
          )}
        </>
      ),
    },
    [MarketplaceEvents.MARKETPLACE_GOODS_WISH_ITEM_ON_SALE]: {
      title: 'Added to the marketplace',
      text: (
        <span className="t-size_13">
          This record was just added to&nbsp;our marketplace and is&nbsp;now available for purchase in&nbsp;digital format
        </span>
      ),
    },
    [PromotionEventsConstants.PROMOTION_POINT_USER_GOT_GEM]: {
      title: 'You got a new gem',
      text: <span className="t-size_13">You can spend it&nbsp;on&nbsp;pre-order with any value</span>,
    },
    [PromotionEventsConstants.PROMOTION_POINT_USER_GOT_GOLDEN_COIN]: {
      title: 'You have a golden coin',
      text: <span className="t-size_13">You can spend it&nbsp;on&nbsp;pre-order with any value</span>,
    },
    [PromotionEventsConstants.PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD]: {
      title: 'Referral reward received',
      text: <span className="t-size_13">You received a&nbsp;referral reward for inviting a&nbsp;friend!</span>,
    },
    [DialogEventsConstants.MESSENGER_PRIVATE_CHAT_NEW_ADMIN_MESSAGE]: {
      title: 'Message from admin',
      children: !deleted ? (
        <div className="t-size_13">
          <EmojiReplaceWrapper text={!!text && typeof text === 'string' ? `"${splitTextUtil(text, 50).introText}"&nbsp;` : ''} />
          <FileUploaderList files={attachments} inline readOnly withLiteBox={false} />
        </div>
      ) : (
        <span className="t-size_13 c-red">message deleted</span>
      ),
    },
    [FollowEventsConstants.USER_SUBSCRIPTIONS_NEW_SUBSCRIBER]: {
      children: (
        <>
          <NickName name={userName} userId={userId} country={titleEn} alias={alias} fontWeight="bold" />
          <br />
          <span className="t-size_13">started following you</span>
        </>
      ),
    },
  };
};

const renderNotifications = ({
  item = {},
  item: { eventType, targetType, target = {}, target: { id: targetId, covers } = {}, to, owner } = {},
  PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD,
  isUnreadEvent,
  eventClassName,
}) => (
  <NotificationEvent
    className={classNames(styles.notificationEvent, eventClassName)}
    wrapperClassName={styles.notificationEvent__wrapper}
    eventMarkerClassName={styles.eventMarker}
    event={item}
    user={
      eventType === ProjectBaseInfoConstants.PROJECT_NEW_COMMENT ||
      eventType === FollowEventsConstants.USER_SUBSCRIPTIONS_NEW_SUBSCRIBER
        ? owner
        : to
    }
    isNotification
    typeContent={typeContent}
    dateType="AGO"
    avatarConfig={{
      size: 48,
      backgroundColor:
        targetType === UserNotificationsTargetTpeConstants.PROMO_ACTION_CODE_USED ||
        targetType === UserNotificationsTargetTpeConstants.PROMOTION_POINT
          ? 'purple'
          : targetType === UserNotificationsTargetTpeConstants.MESSENGER
          ? 'black'
          : 'white',
      isRoute: false,
      isSystemCoin: PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD,
      isSystemGem: eventType === PromotionEventsConstants.PROMOTION_POINT_USER_GOT_GEM,
      isSystemGoldenCoin: eventType === PromotionEventsConstants.PROMOTION_POINT_USER_GOT_GOLDEN_COIN,
      iconSize: PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD ? 22 : 25,
      iconColor: PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD ? 'linear--color__event-coin' : 'linear--color__event-bonus',
    }}
    isUnreadEvent={isUnreadEvent}
  >
    {isEmpty(target) && eventType === ProjectBaseInfoConstants.PROJECT_REJECTED && <span className="c-red">Deleted</span>}
    {!!targetId &&
      (targetType === UserNotificationsTargetTpeConstants.MARKETPLACE_GOODS ||
        targetType === UserNotificationsTargetTpeConstants.PROJECT) && (
        <Cover
          className={styles.projectCover}
          containerClassName={styles.projectCoverContainer}
          covers={covers}
          isDefault
          withImageLiteBox={false}
          size={50}
        >
          {eventType === ProjectEventsConstants.PROJECT_MEDIA_SECURED && <SecuredLabel withDescription={false} />}
          {eventType === ProjectEventsConstants.PROJECT_LINK_EMAIL_SENT && <ProjectRippedLabel getRipLinkAllowed />}
        </Cover>
      )}
  </NotificationEvent>
);

function UserNotification({
  item,
  item: {
    id,
    eventType,
    targetType,
    target,
    to: { deleted } = {},
    target: { title = '', id: targetId } = {},
    owner: { id: userId } = {},
  } = {},
  unreadEvents,
  itemInnerProps: { eventClassName, userNotificationClassName } = {},
}) {
  const className = useMemo(() => classNames(styles.userNotification, userNotificationClassName), [userNotificationClassName]);
  const targetLink = useMemo(() => {
    if (eventType === FollowEventsConstants.USER_SUBSCRIPTIONS_NEW_SUBSCRIBER) {
      return RoutePathsConstants.USER_PROJECTS;
    }
    if (targetType === UserNotificationsTargetTpeConstants.MARKETPLACE_GOODS) {
      return RoutePathsConstants.MARKETPLACE_ITEM;
    }

    if (targetType === UserNotificationsTargetTpeConstants.PROMO_ACTION_CODE_USED) {
      return RoutePathsConstants.INVITES;
    }

    if (targetType === UserNotificationsTargetTpeConstants.MESSENGER) {
      return RoutePathsConstants.CONTACT_ADMIN;
    }

    if (eventType === PromotionEventsConstants.PROMOTION_POINT_USER_GOT_GEM) {
      return RoutePathsConstants.HOT_OFFERS;
    }

    return createProjectUrlUtil(targetId, title);
  }, [eventType, targetId, targetType, title]);

  const PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD = useMemo(
    () => eventType === PromotionEventsConstants.PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD,
    [eventType]
  );

  const isUnreadEvent = useMemo(() => {
    const { [PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED]: unreadEventsIds = {} } = unreadEvents[0] || {};

    return Object.keys(unreadEventsIds).includes(`${id}`);
  }, [unreadEvents, id]);

  return deleted ||
    ((!targetId || (isEmpty(target) && eventType === ProjectBaseInfoConstants.PROJECT_REJECTED)) &&
      targetType !== UserNotificationsTargetTpeConstants.PROMO_ACTION_CODE_USED &&
      targetType !== UserNotificationsTargetTpeConstants.MESSENGER &&
      eventType !== PromotionEventsConstants.PROMOTION_POINT_USER_GOT_GEM) ? (
    <div className={className}>
      {renderNotifications({
        item,
        eventClassName,
        unreadEvents,
        PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD,
        isUnreadEvent,
      })}
    </div>
  ) : (
    <LinkRoute
      className={className}
      href={{
        pathname: parseReplaceTextUtil(
          targetLink,
          eventType === FollowEventsConstants.USER_SUBSCRIPTIONS_NEW_SUBSCRIBER ? userId : targetId
        ),
        query: omitBy(
          {
            section: targetType === UserNotificationsTargetTpeConstants.PROMO_ACTION_CODE_USED ? 'referral' : undefined,
            tab:
              targetType === UserNotificationsTargetTpeConstants.PROJECT
                ? eventType === ProjectBaseInfoConstants.PROJECT_NEW_COMMENT
                  ? 'comments'
                  : 'events'
                : undefined,
            event:
              targetType === UserNotificationsTargetTpeConstants.PROJECT
                ? eventType !== ProjectBaseInfoConstants.PROJECT_NEW_COMMENT
                  ? id
                  : undefined
                : undefined,
          },
          isNil
        ),
      }}
    >
      {renderNotifications({
        item,
        eventClassName,
        unreadEvents,
        PROMO_ACTION_CODE_USED_REFERRAL_AGENT_GOT_REWARD,
        isUnreadEvent,
      })}
    </LinkRoute>
  );
}

export default connect((state) => ({
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(UserNotification);
