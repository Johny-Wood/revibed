import NotificationEvent from '@/components/notifications/NotificationEvent';
import { ProjectEventsConstants } from '@/constants/projects/events';

function ProjectEvent({ active, event, event: { to = {}, eventType } = {}, isUnreadProjectEvent, ...restProps }) {
  return (
    <NotificationEvent
      user={to}
      active={active}
      event={event}
      isUnreadEvent={isUnreadProjectEvent}
      withoutDate={eventType === ProjectEventsConstants.PROJECT_VOTING_ADDED}
      avatarConfig={{
        shown: eventType !== ProjectEventsConstants.PROJECT_VOTING_ADDED,
        size: 36,
        isRoute: true,
      }}
      {...restProps}
    />
  );
}

export default ProjectEvent;
