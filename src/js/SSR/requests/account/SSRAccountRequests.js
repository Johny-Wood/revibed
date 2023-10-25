import { getAccountNotificationsSettingsRequestAction } from '@/redux-actions/account/accountNotificationsSettingsActions';

const accountNotificationsSettingsReducers = {
  EMAIL: 'AccountNotificationsSettingsEmailReducer',
  TELEGRAM_BOT: 'AccountNotificationsSettingsTelegramReducer',
};

export const SSRGetAccountNotificationsSettings = async (
  { req, refreshedToken, store, store: { dispatch } = {} },
  { targetType, token }
) => {
  if (req) {
    await getAccountNotificationsSettingsRequestAction({
      token,
      targetType,
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  } else {
    const { [accountNotificationsSettingsReducers[targetType]]: { getAccountNotificationsSettingsFromApi } = {} } =
      store.getState();

    if (!getAccountNotificationsSettingsFromApi) {
      getAccountNotificationsSettingsRequestAction({
        token,
        targetType,
        cookie: refreshedToken,
        dispatch,
      })
        .then()
        .catch();
    }
  }
};
