import cloneDeep from 'lodash/cloneDeep';

import { EventsActionsConstants } from '@/constants/actions/common/events';
import { SortAndFiltersActionsConstants } from '@/constants/actions/projects/sortAndFilters';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getEventsInProcess: false,
  getEventsInProcessFromApi: false,
  events: [],
};

const createLocalHandlers = (location) =>
  createHandlers({
    [`${location}_${SortAndFiltersActionsConstants.GET_SORT_AND_FILTERS_IN_PROCESS}`]: (
      state,
      { loadSortAndFiltersInProcess }
    ) => ({
      ...state,
      loadSortAndFiltersInProcess,
    }),
    [`${location}_${EventsActionsConstants.GET_EVENTS_IN_PROCESS}`]: (state, { getEventsInProcess }) => ({
      ...state,
      getEventsInProcess,
    }),
    [`${location}_${EventsActionsConstants.GET_EVENTS_SUCCESS}`]: (state, { size, events }) => {
      const newEvents = cloneDeep(events);

      return {
        ...state,
        events: newEvents.slice(0, size),
        getEventsInProcess: false,
        getEventsInProcessFromApi: true,
      };
    },

    [`${location}_${EventsActionsConstants.PROJECT_NEW_CUT}`]: (state, { data: { value } = {}, size = 12 } = {}) => {
      const newEvents = cloneDeep(state.events);

      newEvents.unshift(value);

      return {
        ...state,
        events: newEvents.slice(0, size),
      };
    },

    [`${location}_${EventsActionsConstants.GLOBAL_EVENT_NEW_LAST_RIPPED_PROJECT}`]: (
      state,
      { data: { value, type } = {}, size = 12 } = {}
    ) => {
      const newEvents = cloneDeep(state.events);

      switch (type) {
        case ProjectBaseInfoConstants.PROJECT_LINK_ON_RIP_ADDED: {
          newEvents.unshift(value);

          break;
        }
        default: {
          break;
        }
      }

      return {
        ...state,
        events: newEvents.slice(0, size),
      };
    },
    [`${location}_${EventsActionsConstants.GLOBAL_EVENT_RELOAD_LAST_RIPPED_PROJECTS}`]: (state, { data, size = 12 } = {}) => {
      const newEvents = cloneDeep(data);

      return {
        ...state,
        events: newEvents.slice(0, size),
      };
    },
  });

const createEventsReducer = (state = initialState, action, location) => {
  const handlers = createLocalHandlers(location);

  return createReducer(state, action, handlers);
};

export { createHandlers, createReducer };

export default createEventsReducer;
