import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const UserProjectsReducer = (state, action) => createProjectsReducer(state, action, ProjectsLocationsConstants.PROJECTS_USER);

export default UserProjectsReducer;
