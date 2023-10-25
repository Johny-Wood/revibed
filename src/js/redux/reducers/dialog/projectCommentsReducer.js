import DialogLocationsConstants from '@/constants/dialog/location';

import createDialogReducer from './createDialogReducer';

const ProjectCommentsReducer = (state, action) => createDialogReducer(state, action, DialogLocationsConstants.PROJECT);

export default ProjectCommentsReducer;
