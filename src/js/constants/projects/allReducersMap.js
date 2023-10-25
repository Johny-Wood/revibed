import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import { ProjectsReducersMapConstants } from '@/constants/projects/reducersMap';

export const AllProjectsReducersConstants = {
  ...ProjectsReducersMapConstants,
  [ProjectsLocationsConstants.FUNDING_NOW]: ProjectsReducersConstants.FundingNowEventsReducer,
  [ProjectsLocationsConstants.FUNDING_NOW]: ProjectsReducersConstants.FundingNowEventsReducer,
  [ProjectsLocationsConstants.MY_FEED]: ProjectsReducersConstants.MyFeedReducer,
  [ProjectsLocationsConstants.BLOG]: ProjectsReducersConstants.BlogReducer,
};
