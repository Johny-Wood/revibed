import { connect } from 'react-redux';

import EventsWrapper from '@/components/events/EventsWrapper';
import Projects from '@/components/projects/Projects';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { ProjectsLocationsConstants } from '@/constants/projects/location';

import styles from './styles.module.scss';

const getUnreadEventsList = ({ unreadEvents }) => {
  const { [PersonalNotificationsSectionsConstants.NEW_ARRIVALS]: unreadEventsWithdraw = {} } = unreadEvents[0] || {};

  return Object.keys(unreadEventsWithdraw).map((id) => +id);
};

function NewArrivals({
  getProjectsInProcess,
  loadedProjectsFromApi,
  pageSettings,
  projects,

  unreadEvents,
}) {
  return (
    <EventsWrapper
      location={PersonalNotificationsSectionsConstants.NEW_ARRIVALS}
      deleteFromAllProjects={false}
      eventsIds={getUnreadEventsList({ unreadEvents })}
      readAllLocation
    >
      <Projects
        className={styles.newArrivals}
        infinityScroll
        projects={projects}
        location={ProjectsLocationsConstants.NEW_ARRIVALS}
        projectsLength={projects.length}
        isFullType
        withSort={false}
        withFilters={false}
        withDiscogsFilters={false}
        loadedProjectsFromApi={loadedProjectsFromApi}
        getProjectsInProcess={getProjectsInProcess}
        withPagination={false}
        pageSettings={pageSettings}
      />
    </EventsWrapper>
  );
}

export default connect((state) => ({
  getProjectsInProcess: state.NewArrivalsProjectsReducer.getProjectsInProcess,
  loadedProjectsFromApi: state.NewArrivalsProjectsReducer.loadedProjectsFromApi,
  projects: state.NewArrivalsProjectsReducer.projects,
  pageSettings: state.NewArrivalsProjectsReducer.pageSettings,
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(NewArrivals);
