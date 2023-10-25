import EventsLocationsConstants from '@/constants/events/location';
import MarketplaceEvents from '@/constants/marketplace/events';
import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { ProjectEventsConstants } from '@/constants/projects/events';
import { getProjectEventsRequestAction } from '@/redux-actions/common/projectEventsActions';

export const SSRFundingNow = async ({ req, store: { dispatch, getState } }) => {
  const {
    VariablesReducer: { variablesList: { FUNDING_NOW_PROJECTS_LIMIT } = {} } = {},
    FundingNowEventsReducer: { getEventsInProcessFromApi } = {},
  } = getState();

  const eventsTypes = [
    ProjectEventsConstants.PROJECT_NEW_CUT,
    ProjectBaseInfoConstants.PROJECT_PROMOTION,
    ProjectEventsConstants.PROJECT_MEDIA_SECURED,
    MarketplaceEvents.MARKETPLACE_GOODS_USER_PURCHASE_GOODS,
  ];

  if (req) {
    await getProjectEventsRequestAction({
      location: EventsLocationsConstants.FUNDING_NOW,
      eventsTypes,
      size: FUNDING_NOW_PROJECTS_LIMIT,
      dispatch,
    })
      .then()
      .catch();
  } else if (!getEventsInProcessFromApi) {
    getProjectEventsRequestAction({
      location: EventsLocationsConstants.FUNDING_NOW,
      eventsTypes,
      size: FUNDING_NOW_PROJECTS_LIMIT,
      dispatch,
    })
      .then()
      .catch();
  }
};

export const SSRLastRipped = async (ctx, { dispatch, getState }) => {
  const { req, refreshedToken } = ctx;

  const {
    VariablesReducer: { variablesList: { LAST_RIPPED_PROJECTS_LIMIT } = {} } = {},
    LastRippedEventsReducer: { getEventsInProcessFromApi },
  } = getState();

  if (req) {
    await getProjectEventsRequestAction({
      location: EventsLocationsConstants.LAST_RIPPED,
      eventsTypes: [ProjectBaseInfoConstants.PROJECT_LINK_ON_RIP_ADDED],
      size: LAST_RIPPED_PROJECTS_LIMIT,
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  } else if (!getEventsInProcessFromApi) {
    getProjectEventsRequestAction({
      location: EventsLocationsConstants.LAST_RIPPED,
      eventsTypes: [ProjectBaseInfoConstants.PROJECT_LINK_ON_RIP_ADDED],
      size: LAST_RIPPED_PROJECTS_LIMIT,
      dispatch,
    })
      .then()
      .catch();
  }
};
