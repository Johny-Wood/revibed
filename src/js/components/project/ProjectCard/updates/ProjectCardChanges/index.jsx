import { Component } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import EventsWrapper from '@/components/events/EventsWrapper';
import ProjectEvent from '@/components/project/ProjectCard/updates/ProjectEvent';
import Button from '@/components/ui/buttons/Button';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { ProjectEventsConstants } from '@/constants/projects/events';
import NextRouter from '@/services/NextRouter';

import styles from './styles.module.scss';

const SHOW_ITEMS_COUNT = 5;

class ProjectCardChanges extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showedMore: false,
      activeEventId: -1,
    };
  }

  componentDidMount() {
    this.setEventFocusFromQuery();
  }

  setEventFocusFromQuery = () => {
    const { router: { router: { query: { event } = {} } = {} } = {} } = NextRouter.getInstance();

    if (!event) {
      return;
    }

    this.setState({
      showedMore: true,
      activeEventId: +event,
    });
  };

  getEvents = () => {
    const { events, participationContributor } = this.props;

    const eventsTmp = cloneDeep(events);
    let eventsForMe = eventsTmp;

    if (!participationContributor) {
      eventsForMe = eventsTmp.filter(({ eventType }) => eventType !== ProjectEventsConstants.PROJECT_VOTING_ADDED);
    }

    return orderBy(eventsForMe, ['pinned', 'id'], ['desc', 'desc']) || [];
  };

  renderChanges = ({ isNotDesktop }) => {
    const { canScrollToEvent, setCanScrollToEvent, variablesList: { UNREAD_MARKER_PROJECTS_ENABLED } = {} } = this.props;
    const { showedMore, activeEventId } = this.state;

    return this.getEvents()
      .slice(0, !showedMore && !isNotDesktop ? SHOW_ITEMS_COUNT : this.getEvents().length)
      .map((event, idx) => {
        const { eventType, data, id } = event;

        return (
          <ProjectEvent
            className={styles.notificationEvent}
            wrapperClassName={styles.notificationEvent__wrapper}
            eventMarkerClassName={styles.eventMarker}
            canScrollToEvent={canScrollToEvent}
            setCanScrollToEvent={setCanScrollToEvent}
            active={activeEventId !== 0 ? activeEventId === id : idx === this.getEvents().length - 1}
            isUnreadProjectEvent={this.isUnreadProjectEvent({ id }) && UNREAD_MARKER_PROJECTS_ENABLED}
            event={event}
            key={`project-card-event-${eventType}-${data}-${id}`}
          />
        );
      });
  };

  isUnreadProjectEvent = ({ id }) => {
    const { unreadEvents } = this.props;
    const { [PersonalNotificationsSectionsConstants.PROJECTS_EVENTS]: unreadEventsProject = {} } = unreadEvents[0] || {};

    return Object.keys(unreadEventsProject).includes(`${id}`);
  };

  getUnreadEventsList = () => {
    const { unreadEvents } = this.props;
    const { [PersonalNotificationsSectionsConstants.PROJECTS_EVENTS]: unreadEventsProject = {} } = unreadEvents[0] || {};

    const unreadEventsProjectsIds = Object.keys(unreadEventsProject).map((id) => +id);

    return (
      this.getEvents()
        .filter(({ id }) => unreadEventsProjectsIds.includes(id))
        .map(({ id }) => id) || []
    );
  };

  render() {
    const { showedMore } = this.state;
    const { isNotDesktop } = this.props;

    return (
      <div className={classNames(styles.projectCardChanges, globalStyles.breakWord)}>
        <div className={styles.projectCardChanges__list}>
          <div className={styles.projectCardChanges__container}>
            <EventsWrapper
              location={PersonalNotificationsSectionsConstants.PROJECTS_EVENTS}
              eventsIds={this.getUnreadEventsList()}
            >
              {this.renderChanges({ isNotDesktop })}
            </EventsWrapper>
          </div>
        </div>
        {this.getEvents().length > SHOW_ITEMS_COUNT && !isNotDesktop && (
          <Button
            type="button_string"
            className={styles.showMore}
            text={`Show ${!showedMore ? 'all' : 'less'} updates`}
            onClick={() => {
              this.setState({
                showedMore: !showedMore,
              });
            }}
          />
        )}
      </div>
    );
  }
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(ProjectCardChanges);
