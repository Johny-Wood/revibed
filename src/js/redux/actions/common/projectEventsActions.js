import qs from 'qs';

import api from '@/api';
import { EventsActionsConstants } from '@/constants/actions/common/events';
import { CommonVariablesConstants } from '@/constants/common/variables';

import createAction from '../actionCreator';

const getEventsInProcessAction = ({ location, getEventsInProcess }) =>
  createAction(`${location}_${EventsActionsConstants.GET_EVENTS_IN_PROCESS}`, {
    getEventsInProcess,
  });

const getEventsSuccessAction = ({ location, events, size }) =>
  createAction(`${location}_${EventsActionsConstants.GET_EVENTS_SUCCESS}`, {
    events,
    size,
  });

export const getProjectEventsRequestAction = ({ location, eventsTypes, cookie, size, dispatch }) =>
  new Promise((resolve) => {
    dispatch(getEventsInProcessAction({ location, getEventsInProcess: true }));

    api
      .get('events', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          eventType: eventsTypes,
          size,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: events = {} } }) => {
        dispatch(getEventsSuccessAction({ location, events, size }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(getEventsInProcessAction({ location, getEventsInProcess: false }));
        resolve();
      });
  });
