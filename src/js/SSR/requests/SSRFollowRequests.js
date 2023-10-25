import { getPersonalFollowersRequestAction, getPersonalFollowingRequestAction } from '@/redux-actions/personal/friendsActions';
import { getUserFollowersRequestAction, getUserFollowingRequestAction } from '@/redux-actions/users/usersActions';

export const SSRGetPersonalFollowers = async (ctx, { dispatch }) => {
  const { refreshedToken, req } = ctx;

  if (req) {
    await getPersonalFollowersRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  } else {
    getPersonalFollowersRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  }
};

export const SSRGetPersonalFollowing = async (ctx, { dispatch }) => {
  const { refreshedToken, req } = ctx;

  if (req) {
    await getPersonalFollowingRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  } else {
    getPersonalFollowingRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  }
};

export const SSRGetUserFollowing = async (ctx, { dispatch }) => {
  const { refreshedToken, req, query: { userId } = {} } = ctx;

  if (req) {
    await getUserFollowingRequestAction({ userId, cookie: refreshedToken, dispatch }).then().catch();
  } else {
    getUserFollowingRequestAction({ userId, cookie: refreshedToken, dispatch }).then().catch();
  }
};

export const SSRGetUserFollowers = async (ctx, { dispatch }) => {
  const { refreshedToken, req, query: { userId } = {} } = ctx;

  if (req) {
    await getUserFollowersRequestAction({ userId, cookie: refreshedToken, dispatch }).then().catch();
  } else {
    getUserFollowersRequestAction({ userId, cookie: refreshedToken, dispatch }).then().catch();
  }
};
