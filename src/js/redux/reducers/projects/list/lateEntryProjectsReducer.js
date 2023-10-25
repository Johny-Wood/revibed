import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const LateEntryProjectsReducer = (state, action) => createProjectsReducer(state, action, ProjectsLocationsConstants.LATE_ENTRY);

export default LateEntryProjectsReducer;
