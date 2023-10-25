import { getPersonalCashbackRequestAction } from '@/redux-actions/personal/personalCashbackActions';

export const SSRPersonalCashbackRequests = async ({ req, refreshedToken, store: { dispatch } }) => {
  if (req) {
    await getPersonalCashbackRequestAction({
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  } else {
    getPersonalCashbackRequestAction({
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  }
};
