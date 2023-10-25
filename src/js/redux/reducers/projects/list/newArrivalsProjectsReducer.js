import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const NewArrivalsProjectsReducer = (state, action) =>
  createProjectsReducer(state, action, ProjectsLocationsConstants.NEW_ARRIVALS);

export default NewArrivalsProjectsReducer;
