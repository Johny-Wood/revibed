import { Fragment } from 'react';

import EmojiReplaceWrapper from '@/components/common/emoji/EmojiReplaceWrapper';
import ParseComponent from '@/components/common/ParseComponent';
import NotificationEventContent from '@/components/notifications/NotificationEvent/_components/NotificationEventContent';
import Coin from '@/components/ui/currency/Coin';
import LinkDefault from '@/components/ui/links/LinkDefault';
import NickName from '@/components/user/NickName';
import Voting from '@/components/Voting';
import LateEntrySlotTypesConstants from '@/constants/lateEntry/slot-types';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import TranslateHook from '@/hooks/translate/TranslateHook';
import GemIcon from '@/icons/GemIcon';
import GoldenCoinIcon from '@/icons/GoldenCoinIcon';
import { durationUtil } from '@/utils/dateUtils';
import { floatWithCommaFixedUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const eventContent = ({ to, owner, target, payload = {} } = {}, typeContent = () => {}, t) => {
  const {
    name,
    price,
    type,
    userName,
    userId,
    title = '',
    shortTitle = '',
    leftTimeBeforeVoting = 336,
    sleeve: { real: { title: realSleeveTitle, shortTitle: realSleeveShortTitle } = {} } = {},
    media: { real: { title: realMediaTitle, shortTitle: realMediaShortTitle } = {} } = {},
    bonusesInfo: { counting = [] } = {},
  } = to || {};
  const { closedReason } = payload;

  return {
    [ProjectEventsConstants.PROJECT_ADMIN_HAND_EVENT]: {
      className: styles.notificationEvent_adminHand,
      children: <ParseComponent text={typeof to === 'string' ? to : ''} />,
    },
    [ProjectEventsConstants.PROJECT_VOTING_ADDED]: {
      component: <Voting votingId={to} />,
    },
    [ProjectEventsConstants.PROJECT_RECORD_ON_THE_WAY]: {
      text: <b>The record is on it&apos;s way!</b>,
    },
    [ProjectBaseInfoConstants.PROJECT_STATUS_CHANGED]: {
      text: (
        <>
          <b>Update!</b>
          &nbsp;Pre-order status:&nbsp;
          <b style={{ color: `var(--color__${name})` }}>{t(name)}</b>
          {!!closedReason && (
            <>
              <br />
              {closedReason}
            </>
          )}
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_STATUS_ARRIVED]: {
      text: (
        <>
          <b>Update!</b>
          &nbsp;Pre-order status:&nbsp;
          <b style={{ color: `var(--color__${name})` }}>{t(name)}</b>
          {!!closedReason && (
            <>
              <br />
              {closedReason}
            </>
          )}
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_STATUS_LAST_CALL]: {
      text: (
        <>
          <b>Update!</b>
          &nbsp;Pre-order status:&nbsp;
          <b style={{ color: `var(--color__${name})` }}>{t(name)}</b>
          {!!closedReason && (
            <>
              <br />
              {closedReason}
            </>
          )}
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_FOUND_COMPLETED]: {
      title: <>Pre-order funded!</>,
      text: (
        <>
          The Pre-order&rsquo;s status is&nbsp;now In&nbsp;Transit. We&nbsp;are making arrangements to&nbsp;purchase your record
        </>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_MEDIA_ON_SALE]: {
      text: (
        <>
          Record put on sale for
          {floatWithCommaFixedUtil(price)}
          &euro;
        </>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_MEDIA_SOLD_OUT]: {
      text: (
        <>
          <b>Record sold!</b>
          &nbsp;Tap balance for details. Please delete your archived copy of this pre-order
        </>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_BALANCE_ALLOCATED]: {
      text:
        type === 'INTERMEDIATE' ? (
          <>
            Extra funds after purchase and digitization have been distributed among contributors based on&nbsp;their contribution.
            Tap balance for details
          </>
        ) : (
          <>Funds have been distributed among contributors based on&nbsp;their contribution</>
        ),
    },
    [ProjectEventsConstants.PROJECT_LINK_EMAIL_SENT]: {
      title: <>Archive copy is&nbsp;ready!</>,
      text: (
        <>
          Record will be&nbsp;held for {durationUtil({ hours: leftTimeBeforeVoting }).humanize()} before initialising vote
          to&nbsp;sell
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_NEW_CUT]: {
      children: (
        <>
          <NickName name={userName} userId={userId} withFlag={false} isRoute fontWeight="semi-bold" />
          &nbsp;pre-ordered this release
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_MEDIA_PURCHASED]: {
      children: (
        <div className="w-100pct">
          <b>Media purchased!</b>
          <br />
          The record was successfully purchased. It&nbsp;should ship soon.
        </div>
      ),
    },
    [ProjectEventsConstants.PROJECT_HAND_UP_BALANCE]: {
      text: (
        <div className="f-y-start">
          <Coin size={14} offset={false}>
            <span className="t-semi-bold p-top-1">{floatWithCommaFixedUtil(to)}</span>
          </Coin>
          <span>&nbsp;was debited to&nbsp;pre-order balance from insurance fund</span>
        </div>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_SLEEVE_CONDITION_CHANGED]: {
      text: (
        <>
          Sleeve quality changed&nbsp;to:&nbsp;
          <span className="t-semi-bold">
            {title}
            {!!shortTitle && (
              <>
                &nbsp;(
                {shortTitle})
              </>
            )}
          </span>
        </>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_MEDIA_CONDITION_CHANGED]: {
      text: (
        <>
          Media quality changed&nbsp;to:&nbsp;
          <span className="t-semi-bold">
            {title}
            {!!shortTitle && (
              <>
                &nbsp;(
                {shortTitle})
              </>
            )}
          </span>
        </>
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_DECLARED_REAL_CONDITIONS_DIFFERENCE]: {
      title: 'Record received, not as described',
      text: (
        <>
          {!!realMediaTitle && (
            <>
              Media quality changed&nbsp;to:&nbsp;
              <span className="t-semi-bold">
                {realMediaTitle}
                {!!realMediaShortTitle && (
                  <>
                    &nbsp;(
                    {realMediaShortTitle})
                  </>
                )}
              </span>
            </>
          )}
          {!!realSleeveTitle && (
            <>
              <br />
              Sleeve quality changed&nbsp;to:&nbsp;
              <span className="t-semi-bold">
                {realSleeveTitle}
                {!!realSleeveShortTitle && (
                  <>
                    &nbsp;(
                    {realSleeveShortTitle})
                  </>
                )}
              </span>
            </>
          )}
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_PUBLISHED]: {
      title: 'Pre-order published!',
    },
    [ProjectBaseInfoConstants.PROJECT_CREATED]: {
      title: 'Pre-order published!',
    },
    [ProjectEventsConstants.PROJECT_MEDIA_SECURED]: {
      title: 'Pre-order Update.',
      text: (
        <EmojiReplaceWrapper text="The copy is&nbsp;secured and ready to&nbsp;ship once funding completed. Keep Revibing music!" />
      ),
    },
    [ProjectBaseInfoConstants.PROJECT_RESERVED_FOR_LATE_ENTRY]: {
      title: 'Reserved for late entry',
    },
    [ProjectEventsConstants.PROJECT_MEDIA_RECEIVED_BY_RIPPER]: {
      title: 'Awaiting approval',
      text: <>Once approved, the record will enter the digitization phase</>,
    },
    [ProjectBaseInfoConstants.PROJECT_MEDIA_TRACKING_NUMBER_LINK_CHANGED]: {
      text: (
        <>
          <b>Attention! Tracking number changed!</b>
          {!!to && (
            <>
              <br />
              You can now track the record&nbsp;
              <LinkDefault text="here" href={to} className="c-blue" />
            </>
          )}
        </>
      ),
    },
    [ProjectEventsConstants.PROJECT_JOINED_USER_LATE_ENTRY]: {
      children: (
        <>
          <NickName name={userName} userId={userId} withFlag={false} isRoute fontWeight="semi-bold" />
          &nbsp;has redeemed&nbsp;
          {counting.map(({ type: countingType, cutsCount: countingCutsCount }, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={`late-entry-joined--${countingType}-${countingCutsCount}-${idx}`}>
              {countingCutsCount} {textForLotsOfUtil(countingCutsCount, ['cut', 'cuts'])} for&nbsp;
              {countingType === LateEntrySlotTypesConstants.GOLDEN_COIN && (
                <GoldenCoinIcon className="f-inline m-bottom-2" size={16} />
              )}
              {countingType === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR && (
                <GemIcon className="f-inline m-bottom-2" size={16} />
              )}
              {counting.length > 1 && idx !== counting.length - 1 && ','}
            </Fragment>
          ))}
        </>
      ),
    },
    ...typeContent({ to, payload, owner, target, t }),
  };
};

function NotificationEventType({ eventClassName, event: { eventType, ...event } = {}, typeContent }) {
  const t = TranslateHook();

  return <NotificationEventContent eventClassName={eventClassName} {...eventContent(event, typeContent, t)[eventType]} />;
}

export default NotificationEventType;
