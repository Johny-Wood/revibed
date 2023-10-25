import { connect } from 'react-redux';

import EventsWrapper from '@/components/events/EventsWrapper';
import ReleasesItems from '@/components/release/ReleaseWrapper/_components/ReleasesItems';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';

const ITEMS_PER_PAGE_OPTIONS = [
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
  {
    id: 250,
    value: 250,
    label: '250',
  },
];

const getUnreadEventsList = ({ unreadEvents, releaseItems }) => {
  const { [PersonalNotificationsSectionsConstants.WANT_LIST_RELEASES_ITEMS]: unreadEventsWantlistReleasesItems = {} } =
    unreadEvents[0] || {};
  const unreadEventsIds = Object.keys(unreadEventsWantlistReleasesItems).map((id) => +id);

  return releaseItems.filter(({ id }) => unreadEventsIds.includes(id)).map(({ id }) => id) || [];
};

function WantlistNotifications({
  releaseItems,
  inProcess,
  onLoad,
  pageSettings,
  pageSettings: { page: { currentNumber = 0 } = {} } = {},

  unreadEvents,
}) {
  return (
    <EventsWrapper
      location={PersonalNotificationsSectionsConstants.WANT_LIST_RELEASES_ITEMS}
      deleteFromAllProjects={false}
      eventsIds={getUnreadEventsList({
        unreadEvents,
        releaseItems,
      })}
      isStartDeleteUnreadEventsMarkers={currentNumber + 1}
    >
      <ReleasesItems
        items={releaseItems}
        inProcess={inProcess}
        onLoad={onLoad}
        pageSettings={pageSettings}
        itemsPerPage={ITEMS_PER_PAGE_OPTIONS}
        withNotifications
      />
    </EventsWrapper>
  );
}

export default connect((state) => ({
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(WantlistNotifications);
