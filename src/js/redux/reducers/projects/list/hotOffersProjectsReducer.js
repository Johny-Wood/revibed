import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const HotOffersProjectsReducer = (state, action) =>
  createProjectsReducer(state, action, ProjectsLocationsConstants.LATE_ENTRY_FULL);

export default HotOffersProjectsReducer;
