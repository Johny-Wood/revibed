import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { PersonalNotificationCountsActionsConstants } from '@/constants/actions/personal/personalNotificationCounts';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { NotificationsDependenceProjectLocationsConstants } from '@/constants/projects/notifications';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  deleteUnreadEventInProcess: false,

  getUnreadEventsInProcess: false,
  unreadEvents: [],
};

const handlers = createHandlers({
  [PersonalNotificationCountsActionsConstants.GET_UNREAD_EVENTS_IN_PROCESS]: (state, { getUnreadEventsInProcess }) => ({
    ...state,
    getUnreadEventsInProcess,
  }),
  [PersonalNotificationCountsActionsConstants.GET_UNREAD_EVENTS_SUCCESS]: (state, { unreadEvents }) => ({
    ...state,
    getUnreadEventsInProcess: false,
    unreadEvents: [unreadEvents],
  }),

  [PersonalNotificationCountsActionsConstants.DELETE_UNREAD_EVENT_IN_PROCESS]: (state, { deleteUnreadEventInProcess }) => ({
    ...state,
    deleteUnreadEventInProcess,
  }),
  [PersonalNotificationCountsActionsConstants.REMOVE_UNREAD_EVENT]: (
    state,
    { projectIds = [], deleteFromAllProjects = true, location }
  ) => {
    const unreadEventsArr = cloneDeep(state.unreadEvents);
    const [unreadEvents] = unreadEventsArr || {};

    const sections = [...NotificationsDependenceProjectLocationsConstants, PersonalNotificationsSectionsConstants.BALANCE];

    if (!isEmpty(unreadEvents)) {
      if (deleteFromAllProjects) {
        sections.forEach((locationLocal) => {
          projectIds.forEach((projectId) => {
            if (!isEmpty(unreadEvents[locationLocal]) && unreadEvents[locationLocal][`${projectId}`]) {
              delete unreadEvents[locationLocal][`${projectId}`];
            }
          });
        });
      } else if (location) {
        if ([...NotificationsDependenceProjectLocationsConstants].includes(location)) {
          cloneDeep(Object.keys(unreadEvents)).forEach((locationLocal) => {
            if ([...NotificationsDependenceProjectLocationsConstants].includes(locationLocal)) {
              projectIds.forEach((projectId) => {
                if (unreadEvents[locationLocal][`${projectId}`]) {
                  const newCountUnreadEvents =
                    unreadEvents[locationLocal][`${projectId}`] - unreadEvents[location][`${projectId}`];

                  if (newCountUnreadEvents > 0) {
                    unreadEvents[locationLocal][`${projectId}`] = newCountUnreadEvents;
                  } else {
                    delete unreadEvents[locationLocal][`${projectId}`];
                  }
                }
              });
            }
          });
        } else {
          projectIds.forEach((projectId) => {
            if (unreadEvents[location][`${projectId}`]) {
              delete unreadEvents[location][`${projectId}`];
            }
          });
        }
      }
    }

    return {
      ...state,
      unreadEvents: [unreadEvents],
      deleteUnreadEventInProcess: false,
    };
  },

  [PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT]: (state, { projectId = -1, sections = [] }) => {
    const unreadEvents = cloneDeep(state.unreadEvents);

    sections.forEach((location) => {
      const eventsOfLocation = unreadEvents[0][location] || {};
      const eventsOfLocationProjectCount = eventsOfLocation[projectId] || 0;

      unreadEvents[0][location] = unreadEvents[0][location]
        ? {
            ...unreadEvents[0][location],
            [projectId]: eventsOfLocationProjectCount + 1,
          }
        : {
            [projectId]: eventsOfLocationProjectCount + 1,
          };
    });

    return {
      ...state,
      unreadEvents,
    };
  },

  [PersonalNotificationCountsActionsConstants.DELETE_UNREAD_EVENTS_SECTION]: (state, { sections = [] }) => {
    const unreadEvents = cloneDeep(state.unreadEvents);

    if (unreadEvents.length > 0) {
      sections.forEach((sectionId) => {
        delete unreadEvents[0][sectionId];
      });
    }

    return {
      ...state,
      unreadEvents,
    };
  },
});

const PersonalNotificationCountsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PersonalNotificationCountsReducer;
