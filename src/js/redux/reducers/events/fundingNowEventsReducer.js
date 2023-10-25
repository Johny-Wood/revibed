import EventsLocationsConstants from '@/constants/events/location';

import createEventsReducer from './createEventsReducer';

const FundingNowEventsReducer = (state, action) => createEventsReducer(state, action, EventsLocationsConstants.FUNDING_NOW);

export default FundingNowEventsReducer;
