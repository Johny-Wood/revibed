import { PersonalNotificationCountsActionsConstants } from '@/constants/actions/personal/personalNotificationCounts';
import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { CommonNavigationsConstants } from '@/constants/common/navigation';
import ReduxStoreService from '@/services/ReduxStoreService';

export const websocketNewEventsHandlerUtil = ({ projectId, data }) => {
  const { value: { id: newEventId } = {} } = data;
  const { store } = ReduxStoreService.getInstance();
  const { userIsAuthorized, userInfo: { id: userIdStore } = {} } = store.getState().AuthReducer;

  if (newEventId >= 0 && userIsAuthorized) {
    store.dispatch({
      type: PersonalNotificationCountsActionsConstants.ADD_UNREAD_EVENT,
      payload: {
        sections: [CommonNavigationsConstants.PROJECTS_EVENTS],
        projectId: newEventId,
      },
    });
  }

  store.dispatch({
    type: ProjectsActionsConstants.PROJECT_NEW_EVENT,
    payload: {
      projectId,
      data,
      userIdStore,
    },
  });
};
