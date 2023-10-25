import DialogLocationsConstants from '@/constants/dialog/location';

import createDialogReducer from './createDialogReducer';

const AdminDialogReducer = (state, action) => createDialogReducer(state, action, DialogLocationsConstants.ADMIN);

export default AdminDialogReducer;
