import { UsersActionsConstants } from '@/constants/actions/users';
import { changeFollowUtil } from '@/utils/followUtil';

import { createHandlers, createReducer } from '../handler';

const followersInitialState = {
  getUserFollowersInProcess: false,
  getUserFollowersFromApi: false,
  followers: [],
  followersPageSettings: {},
};

const followingInitialState = {
  getUserFollowingInProcess: false,
  getUserFollowingFromApi: false,
  following: [],
  followingPageSettings: {},
};

const initialState = {
  getUsersInfoInProcess: false,
  userInfo: {},

  ...followersInitialState,
  ...followingInitialState,
};

const handlers = createHandlers({
  [UsersActionsConstants.GET_USERS_INFO_IN_PROCESS]: (state, { getUsersInfoInProcess }) => ({
    ...state,
    getUsersInfoInProcess,
  }),
  [UsersActionsConstants.GET_USERS_INFO_SUCCESS]: (state, { userInfo, userId }) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      [userId]: userInfo,
    },
    getUsersInfoInProcess: false,
  }),
  [UsersActionsConstants.GET_USERS_INFO_FAILED]: (state) => ({
    ...state,
    userInfo: {},
    getUsersInfoInProcess: false,
  }),

  [UsersActionsConstants.USERS_CHANGE_FOLLOW_USER]: (state, { userId, isFollowing }) => {
    if (!state.userInfo[userId]) {
      return { ...state };
    }

    const { subscribersCount } = state.userInfo[userId];

    return {
      ...state,
      userInfo: {
        ...state.userInfo,
        [userId]: {
          ...state.userInfo[userId],
          subscribersCount: subscribersCount + (isFollowing ? 1 : -1),
          subscription: isFollowing,
        },
      },
    };
  },

  [UsersActionsConstants.GET_USERS_FOLLOWING_USER_IN_PROCESS]: (state, { getUserFollowingInProcess }) => ({
    ...state,
    getUserFollowingInProcess,
  }),
  [UsersActionsConstants.GET_USERS_FOLLOWING_USER_SUCCESS]: (state, { following, followingPageSettings }) => ({
    ...state,
    following,
    followingPageSettings,
    getUserFollowingInProcess: false,
    getUserFollowingFromApi: true,
  }),
  [UsersActionsConstants.GET_USERS_FOLLOWERS_USER_IN_PROCESS]: (state, { getUserFollowersInProcess }) => ({
    ...state,
    getUserFollowersInProcess,
  }),
  [UsersActionsConstants.GET_USERS_FOLLOWERS_USER_SUCCESS]: (state, { followers, followersPageSettings }) => ({
    ...state,
    followers,
    followersPageSettings,
    getUserFollowersInProcess: false,
    getUserFollowersFromApi: true,
  }),
  [UsersActionsConstants.RESET_USERS_FOLLOWERS_USER]: (state) => ({
    ...state,
    ...followersInitialState,
  }),
  [UsersActionsConstants.RESET_USERS_FOLLOWING_USER]: (state) => ({
    ...state,
    ...followingInitialState,
  }),
  [UsersActionsConstants.USER_FOLLOW_CHANGE_FOLLOW_USER]: (state, { userId, isFollowing }) => ({
    ...state,
    followers: changeFollowUtil({ list: state.followers, userId, isFollowing }),
    following: changeFollowUtil({ list: state.following, userId, isFollowing }),
  }),
});

const UsersReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default UsersReducer;
