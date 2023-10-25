import UnsubscribeTypesConstants from '@/constants/unsubscribe/type';
import { changeUnsubscribeTypeAction, getUnsubscribeTypeRequestAction } from '@/redux-actions/email/unsubscribeActions';
import { SSRGetAccountNotificationsSettings } from '@/SSR/requests/account/SSRAccountRequests';

const getFullTypeForm = async (ctx, token) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetAccountNotificationsSettings(ctx, {
      targetType: 'EMAIL',
      token,
    })
  );

  await Promise.all(awaitPromises);
};

export const SSRGetUnsubscribeType = async (ctx, userIsAuthorized) => {
  const { req, query: { token } = {}, store: { dispatch } = {} } = ctx;

  if (userIsAuthorized && !token) {
    dispatch(changeUnsubscribeTypeAction(UnsubscribeTypesConstants.FULL));
    await getFullTypeForm(ctx, token);
  } else if (req) {
    await getUnsubscribeTypeRequestAction(token)(dispatch)
      .then(async ({ unsubscribeType }) => {
        if (unsubscribeType === UnsubscribeTypesConstants.FULL) {
          await getFullTypeForm(ctx, token);
        }
      })
      .catch();
  } else {
    getUnsubscribeTypeRequestAction(token)(dispatch).then().catch();
  }
};
