import { connect } from 'react-redux';

import EventsWrapper from '@/components/events/EventsWrapper';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import MyFeedProjects from '@/pages/main-projects/MainProjectsPageWrapper/_components/MyFeed/_components/MyFeedProjects';

const getUnreadEventsList = ({ unreadEvents }) => {
  const { [PersonalNotificationsSectionsConstants.CUSTOM_FEED]: unreadEventsFeed = {} } = unreadEvents[0] || {};

  return Object.keys(unreadEventsFeed).map((id) => +id);
};

function MyFeed({ unreadEvents }) {
  return (
    <EventsWrapper
      location={PersonalNotificationsSectionsConstants.CUSTOM_FEED}
      deleteFromAllProjects={false}
      eventsIds={getUnreadEventsList({ unreadEvents })}
      readAllLocation
    >
      <MyFeedProjects />
    </EventsWrapper>
  );
}

export default connect((state) => ({
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(MyFeed);
