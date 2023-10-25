import { getPersonalUserNotificationsRequestAction } from '@/redux-actions/personal/personalUserNotificationsActions';

export const SSRLoadUserNotifications = async ({ ctx }) => {
  const { refreshedToken, req, store, store: { dispatch } = {} } = ctx;

  const { getPersonalUserNotificationsFromApi } = store.getState().PersonalUserNotificationsReducer;

  if (req) {
    await getPersonalUserNotificationsRequestAction({
      dispatch,
      cookie: refreshedToken,
    })
      .then()
      .catch();
  } else if (!getPersonalUserNotificationsFromApi) {
    getPersonalUserNotificationsRequestAction({ dispatch }).then().catch();
  }
};
