import { ProjectsLocationsConstants } from '@/constants/projects/location';

import createProjectsReducer from './createProjectsReducer';

const MyFeedReducer = (state, action) => createProjectsReducer(state, action, ProjectsLocationsConstants.MY_FEED);

export default MyFeedReducer;
