import qs from 'qs';

import api from '@/api';
import { UsersActionsConstants } from '@/constants/actions/users';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getUsersInfoInProcessAction = (getUsersInfoInProcess) =>
  createAction(UsersActionsConstants.GET_USERS_INFO_IN_PROCESS, {
    getUsersInfoInProcess,
  });

const getUsersInfoSuccessAction = ({ userInfo, userId }) =>
  createAction(UsersActionsConstants.GET_USERS_INFO_SUCCESS, {
    userInfo,
    userId,
  });

const getUsersInfoFailedAction = () => createAction(UsersActionsConstants.GET_USERS_INFO_FAILED);

export const changeFollowUsersAction = ({ userId, isFollowing }) =>
  createAction(UsersActionsConstants.USERS_CHANGE_FOLLOW_USER, {
    userId,
    isFollowing,
  });

export const getUsersInfoRequestAction = ({ cookie, userId, dispatch }) =>
  new Promise((then) => {
    dispatch(getUsersInfoInProcessAction(true));

    api
      .get(`users/${userId}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: userInfo = {} } = {} }) => {
        dispatch(getUsersInfoSuccessAction({ userId, userInfo }));

        then();
      })
      .catch((error) => {
        console.error(error);
        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getUsersInfoFailedAction());

        then(errorData);
      });
  });

const getUserFollowingInProcessAction = (getUserFollowingInProcess) =>
  createAction(UsersActionsConstants.GET_USERS_FOLLOWING_USER_IN_PROCESS, {
    getUserFollowingInProcess,
  });

const getUserFollowingSuccessAction = ({ following, followingPageSettings }) =>
  createAction(UsersActionsConstants.GET_USERS_FOLLOWING_USER_SUCCESS, {
    following,
    followingPageSettings,
  });

export const getUserFollowingRequestAction = ({ userId, pageSize, pageNumber, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { followersPageSettings: { page: { size, page } = {} } = {} } = store.getState().UsersReducer || {};

    dispatch(getUserFollowingInProcessAction(true));

    api
      .get(`users/${userId}/subscriptions`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {}, payload } = {} }) => {
        dispatch(getUserFollowingSuccessAction({ following: responseData, followingPageSettings: payload }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getUserFollowingInProcessAction(false));

        reject(errorData);
      });
  });

const getUserFollowersInProcessAction = (getUserFollowersInProcess) =>
  createAction(UsersActionsConstants.GET_USERS_FOLLOWERS_USER_IN_PROCESS, {
    getUserFollowersInProcess,
  });

const getUserFollowersSuccessAction = ({ followers, followersPageSettings }) =>
  createAction(UsersActionsConstants.GET_USERS_FOLLOWERS_USER_SUCCESS, {
    followers,
    followersPageSettings,
  });

export const getUserFollowersRequestAction = ({ userId, pageSize, pageNumber, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { followersPageSettings: { page: { size, page } = {} } = {} } = store.getState().UsersReducer || {};

    dispatch(getUserFollowersInProcessAction(true));

    api
      .get(`users/${userId}/subscribers`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {}, payload } = {} }) => {
        dispatch(getUserFollowersSuccessAction({ followers: responseData, followersPageSettings: payload }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getUserFollowersInProcessAction(false));

        reject(errorData);
      });
  });

export const resetUserFollowersAction = () => createAction(UsersActionsConstants.RESET_USERS_FOLLOWERS_USER);

export const resetUserFollowingAction = () => createAction(UsersActionsConstants.RESET_USERS_FOLLOWING_USER);

export const changeFollowInUserFollowAction = ({ userId, isFollowing }) =>
  createAction(UsersActionsConstants.USER_FOLLOW_CHANGE_FOLLOW_USER, {
    userId,
    isFollowing,
  });
