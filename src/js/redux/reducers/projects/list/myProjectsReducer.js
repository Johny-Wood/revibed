import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const MyProjectsReducer = (state, action) => createProjectsReducer(state, action, ProjectsLocationsConstants.MY_PROJECTS);

export default MyProjectsReducer;
