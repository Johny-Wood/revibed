import EventsLocationsConstants from '@/constants/events/location';

import createEventsReducer from './createEventsReducer';

const LastRippedEventsReducer = (state, action) => createEventsReducer(state, action, EventsLocationsConstants.LAST_RIPPED);

export default LastRippedEventsReducer;
