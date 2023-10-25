import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const DefaultProjectsReducer = (state, action) => createProjectsReducer(state, action, ProjectsLocationsConstants.PROJECTS);

export default DefaultProjectsReducer;
