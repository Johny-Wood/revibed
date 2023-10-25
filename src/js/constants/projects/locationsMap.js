import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { RoutePathsConstants } from '@/constants/routes/routes';

export const ProjectsLocationsMapConstants = {
  [ProjectsLocationsConstants.FUNDING_NOW]: RoutePathsConstants.MAIN,
  [ProjectsLocationsConstants.TRENDING]: RoutePathsConstants.MAIN,
  [ProjectsLocationsConstants.NEW_ARRIVALS]: RoutePathsConstants.MAIN,
  [ProjectsLocationsConstants.LATE_ENTRY]: RoutePathsConstants.MAIN,

  [ProjectsLocationsConstants.LATE_ENTRY_FULL]: RoutePathsConstants.HOT_OFFERS,

  [ProjectsLocationsConstants.PROJECTS]: RoutePathsConstants.PROJECTS,

  [ProjectsLocationsConstants.RIPPER]: RoutePathsConstants.RIPPER,
  [ProjectsLocationsConstants.MY_PROJECTS]: RoutePathsConstants.MY_PROJECTS,
  [ProjectsLocationsConstants.MY_FEED]: RoutePathsConstants.FEED,
};
