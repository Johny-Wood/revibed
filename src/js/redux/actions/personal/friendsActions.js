import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const PERSONAL_API_URL = 'personal';

const onlySearchPersonalSubscriptionsInProcessAction = (onlySearchLoadPersonalSubscriptionsInProcess) =>
  createAction(PersonalActionsConstants.ONLY_SEARCH_LOAD_PERSONAL_SUBSCRIPTIONS_IN_PROCESS, {
    onlySearchLoadPersonalSubscriptionsInProcess,
  });

const onlySearchPersonalSubscriptionsSuccessAction = (friendsSearched) =>
  createAction(PersonalActionsConstants.ONLY_SEARCH_PERSONAL_SUBSCRIPTIONS_SUCCESS, {
    friendsSearched,
  });

const personalSubscriptionInProcessAction = ({ inProcess, userId }) =>
  createAction(PersonalActionsConstants.PERSONAL_SUBSCRIPTION_IN_PROCESS, {
    inProcess,
    userId,
  });

const personalSubscriptionSuccessAction = (personalSubscription, userId) =>
  createAction(PersonalActionsConstants.PERSONAL_SUBSCRIPTION_SUCCESS, {
    personalSubscription,
    userId,
  });

const personalUnsubscriptionInProcessAction = ({ inProcess, userId }) =>
  createAction(PersonalActionsConstants.PERSONAL_UNSUBSCRIPTION_IN_PROCESS, {
    inProcess,
    userId,
  });

const personalUnsubscriptionSuccessAction = (userId) =>
  createAction(PersonalActionsConstants.PERSONAL_UNSUBSCRIPTION_SUCCESS, {
    userId,
  });

let cancelTokenOnlySearchPersonalSubscriptionsRequest;
export const onlySearchPersonalSubscriptionsRequestAction = (nickname) => (dispatch) =>
  new Promise((resolve, reject) => {
    if (cancelTokenOnlySearchPersonalSubscriptionsRequest) {
      cancelTokenOnlySearchPersonalSubscriptionsRequest.cancel();
    }

    cancelTokenOnlySearchPersonalSubscriptionsRequest = axios.CancelToken.source();

    dispatch(onlySearchPersonalSubscriptionsInProcessAction(true));

    api
      .get(`${PERSONAL_API_URL}/subscriptions/subscriptions`, {
        cancelToken: cancelTokenOnlySearchPersonalSubscriptionsRequest.token,
        params: { name: nickname },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(onlySearchPersonalSubscriptionsSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(onlySearchPersonalSubscriptionsInProcessAction(axios.isCancel(error)));

        reject(errorData);
      });
  });

export const personalSubscriptionRequestAction = (userId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(personalSubscriptionInProcessAction({ inProcess: true, userId }));

    api
      .post(`${PERSONAL_API_URL}/subscriptions`, {
        userId,
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(personalSubscriptionSuccessAction(responseData, userId));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(personalSubscriptionInProcessAction({ inProcess: false, userId }));

        reject(errorData);
      });
  });

export const personalUnsubscriptionRequestAction = (userId) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(personalUnsubscriptionInProcessAction({ inProcess: true, userId }));

    api
      .delete(`${PERSONAL_API_URL}/subscriptions`, {
        data: { userId },
      })
      .then(() => {
        dispatch(personalUnsubscriptionSuccessAction(userId));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(personalUnsubscriptionInProcessAction({ inProcess: false, userId }));

        reject(errorData);
      });
  });

const getPersonalFollowersInProcessAction = (getPersonalFollowersInProcess) =>
  createAction(PersonalActionsConstants.GET_PERSONAL_FOLLOWERS_IN_PROCESS, {
    getPersonalFollowersInProcess,
  });

const getPersonalFollowersSuccessAction = ({ followers, followersPageSettings }) =>
  createAction(PersonalActionsConstants.GET_PERSONAL_FOLLOWERS_SUCCESS, {
    followers,
    followersPageSettings,
  });

export const getPersonalFollowersRequestAction = ({ pageSize, pageNumber, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { followersPageSettings: { page: { size, page } = {} } = {} } = store.getState().FriendsReducer || {};

    dispatch(getPersonalFollowersInProcessAction(true));

    api
      .get(`${PERSONAL_API_URL}/subscriptions/subscribers`, {
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
        dispatch(
          getPersonalFollowersSuccessAction({
            followers: responseData,
            followersPageSettings: payload,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getPersonalFollowersInProcessAction(false));

        reject(errorData);
      });
  });

const getPersonalFollowingInProcessAction = (getPersonalFollowingInProcess) =>
  createAction(PersonalActionsConstants.GET_PERSONAL_FOLLOWING_IN_PROCESS, {
    getPersonalFollowingInProcess,
  });

const getPersonalFollowingSuccessAction = ({ following, followingPageSettings }) =>
  createAction(PersonalActionsConstants.GET_PERSONAL_FOLLOWING_SUCCESS, {
    following,
    followingPageSettings,
  });

export const getPersonalFollowingRequestAction = ({ pageSize, pageNumber, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { followersPageSettings: { page: { size, page } = {} } = {} } = store.getState().FriendsReducer || {};

    dispatch(getPersonalFollowingInProcessAction(true));

    api
      .get(`${PERSONAL_API_URL}/subscriptions/subscriptions`, {
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
        dispatch(
          getPersonalFollowingSuccessAction({
            following: responseData,
            followingPageSettings: payload,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getPersonalFollowingInProcessAction(false));

        reject(errorData);
      });
  });

export const changeFollowInFollowersAction = ({ userId, isFollowing }) =>
  createAction(PersonalActionsConstants.PERSONAL_FOLLOWERS_CHANGE_FOLLOW_USER, {
    userId,
    isFollowing,
  });

export const changeFollowInFollowingAction = ({ userId, isFollowing }) =>
  createAction(PersonalActionsConstants.PERSONAL_FOLLOWING_CHANGE_FOLLOW_USER, {
    userId,
    isFollowing,
  });
