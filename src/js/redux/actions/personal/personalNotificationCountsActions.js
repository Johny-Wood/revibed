import qs from 'qs';

import api from '@/api';
import { PersonalNotificationCountsActionsConstants } from '@/constants/actions/personal/personalNotificationCounts';
import { CommonVariablesConstants } from '@/constants/common/variables';

import createAction from '../actionCreator';

const getUnreadEventsInProcessAction = (getUnreadEventsInProcess) =>
  createAction(PersonalNotificationCountsActionsConstants.GET_UNREAD_EVENTS_IN_PROCESS, {
    getUnreadEventsInProcess,
  });

const getUnreadEventsSuccessAction = (unreadEvents) =>
  createAction(PersonalNotificationCountsActionsConstants.GET_UNREAD_EVENTS_SUCCESS, {
    unreadEvents,
  });

const deleteUnreadEventInProcessAction = (deleteUnreadEventInProcess) =>
  createAction(PersonalNotificationCountsActionsConstants.DELETE_UNREAD_EVENT_IN_PROCESS, {
    deleteUnreadEventInProcess,
  });

export const deleteUnreadPersonalNotificationCountsEventAction = (projectIds, { deleteFromAllProjects, location }) =>
  createAction(PersonalNotificationCountsActionsConstants.REMOVE_UNREAD_EVENT, {
    projectIds,
    deleteFromAllProjects,
    location,
  });

export const deleteUnreadPersonalNotificationCountsEventSectionAction = ({ sections = [] }) =>
  createAction(PersonalNotificationCountsActionsConstants.DELETE_UNREAD_EVENTS_SECTION, {
    sections,
  });

export const getUnreadPersonalNotificationCountsEventsRequestAction = ({ cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getUnreadEventsInProcessAction(true));

    api
      .get('personal/unread-events', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: unreadEvents = {} } = {} }) => {
        dispatch(getUnreadEventsSuccessAction(unreadEvents));

        resolve();
      })
      .catch(() => {
        dispatch(getUnreadEventsInProcessAction(false));

        reject();
      });
  });

export const deleteUnreadPersonalNotificationCountsEventRequestAction =
  (projectIds = [], location) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(deleteUnreadEventInProcessAction(true));

      api
        .delete('personal/unread-events', {
          data: projectIds,
          params: { location },
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then(() => {
          dispatch(deleteUnreadEventInProcessAction(false));

          resolve();
        })
        .catch(() => {
          dispatch(deleteUnreadEventInProcessAction(false));

          reject();
        });
    });
