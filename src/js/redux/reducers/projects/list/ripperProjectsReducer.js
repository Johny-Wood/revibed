import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const RipperProjectsReducer = (state, action) => createProjectsReducer(state, action, ProjectsLocationsConstants.RIPPER);

export default RipperProjectsReducer;
