import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';

export const ProjectsReducersMapConstants = {
  [ProjectsLocationsConstants.TRENDING]: ProjectsReducersConstants.TrendingReducer,
  [ProjectsLocationsConstants.NEW_ARRIVALS]: ProjectsReducersConstants.NewArrivalsProjectsReducer,
  [ProjectsLocationsConstants.LATE_ENTRY]: ProjectsReducersConstants.LateEntryProjectsReducer,
  [ProjectsLocationsConstants.LATE_ENTRY_FULL]: ProjectsReducersConstants.HotOffersProjectsReducer,

  [ProjectsLocationsConstants.PROJECTS]: ProjectsReducersConstants.DefaultProjectsReducer,

  [ProjectsLocationsConstants.RIPPER]: ProjectsReducersConstants.RipperProjectsReducer,
  [ProjectsLocationsConstants.MY_PROJECTS]: ProjectsReducersConstants.MyProjectsReducer,

  [ProjectsLocationsConstants.PROJECTS_USER]: ProjectsReducersConstants.UserProjectsReducer,

  [ProjectsLocationsConstants.MY_FEED]: ProjectsReducersConstants.MyFeedReducer,
};
