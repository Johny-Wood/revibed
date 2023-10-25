import cloneDeep from 'lodash/cloneDeep';

import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import { changeFollowUtil } from '@/utils/followUtil';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadPersonalSubscriptionsInProcess: false,
  personalSubscriptions: [],
  subscriptionsSettings: {},

  personalSubscriptionInProcess: [],
  personalUnsubscriptionInProcess: [],

  onlySearchLoadPersonalSubscriptionsInProcess: false,
  friendsSearched: [],

  getPersonalFollowersInProcess: false,
  getPersonalFollowersFromApi: false,
  followers: [],
  followersPageSettings: {},

  getPersonalFollowingInProcess: false,
  getPersonalFollowingFromApi: false,
  following: [],
  followingPageSettings: {},
};

const deleteSubscription = ({ ids, userId }) => {
  const endIds = cloneDeep(ids);

  const foundIdx = endIds.findIndex((id) => id === userId);

  if (foundIdx !== -1) {
    endIds.splice(foundIdx, 1);
  }

  return endIds;
};

const handlers = createHandlers({
  [PersonalActionsConstants.PERSONAL_SUBSCRIPTION_IN_PROCESS]: (state, { inProcess, userId }) => {
    let personalSubscriptionInProcess = cloneDeep(state.personalSubscriptionInProcess);

    if (inProcess) {
      personalSubscriptionInProcess.push(userId);
    } else {
      personalSubscriptionInProcess = deleteSubscription({
        ids: personalSubscriptionInProcess,
        userId,
      });
    }

    return {
      ...state,
      personalSubscriptionInProcess,
    };
  },
  [PersonalActionsConstants.PERSONAL_SUBSCRIPTION_SUCCESS]: (state, { userId }) => ({
    ...state,
    personalSubscriptionInProcess: deleteSubscription({
      ids: state.personalSubscriptionInProcess,
      userId,
    }),
  }),
  [PersonalActionsConstants.PERSONAL_UNSUBSCRIPTION_IN_PROCESS]: (state, { inProcess, userId }) => {
    let personalUnsubscriptionInProcess = cloneDeep(state.personalUnsubscriptionInProcess);

    if (inProcess) {
      personalUnsubscriptionInProcess.push(userId);
    } else {
      personalUnsubscriptionInProcess = deleteSubscription({
        ids: personalUnsubscriptionInProcess,
        userId,
      });
    }

    return {
      ...state,
      personalUnsubscriptionInProcess,
    };
  },
  [PersonalActionsConstants.PERSONAL_UNSUBSCRIPTION_SUCCESS]: (state, { userId }) => ({
    ...state,
    personalUnsubscriptionInProcess: deleteSubscription({
      ids: state.personalUnsubscriptionInProcess,
      userId,
    }),
  }),
  [PersonalActionsConstants.ONLY_SEARCH_LOAD_PERSONAL_SUBSCRIPTIONS_IN_PROCESS]: (
    state,
    { onlySearchLoadPersonalSubscriptionsInProcess }
  ) => ({
    ...state,
    onlySearchLoadPersonalSubscriptionsInProcess,
  }),
  [PersonalActionsConstants.ONLY_SEARCH_PERSONAL_SUBSCRIPTIONS_SUCCESS]: (state, { friendsSearched }) => ({
    ...state,
    onlySearchLoadPersonalSubscriptionsInProcess: false,
    friendsSearched,
  }),

  [PersonalActionsConstants.GET_PERSONAL_FOLLOWERS_IN_PROCESS]: (state, { getPersonalFollowersInProcess }) => ({
    ...state,
    getPersonalFollowersInProcess,
  }),
  [PersonalActionsConstants.GET_PERSONAL_FOLLOWERS_SUCCESS]: (state, { followers, followersPageSettings }) => ({
    ...state,
    followers,
    followersPageSettings,
    getPersonalFollowersInProcess: false,
    getPersonalFollowersFromApi: true,
  }),

  [PersonalActionsConstants.GET_PERSONAL_FOLLOWING_IN_PROCESS]: (state, { getPersonalFollowingInProcess }) => ({
    ...state,
    getPersonalFollowingInProcess,
  }),
  [PersonalActionsConstants.GET_PERSONAL_FOLLOWING_SUCCESS]: (state, { following, followingPageSettings }) => ({
    ...state,
    following,
    followingPageSettings,
    getPersonalFollowingInProcess: false,
    getPersonalFollowingFromApi: true,
  }),

  [PersonalActionsConstants.PERSONAL_FOLLOWERS_CHANGE_FOLLOW_USER]: (state, { userId, isFollowing }) => ({
    ...state,
    followers: changeFollowUtil({ list: state.followers, userId, isFollowing }),
  }),

  [PersonalActionsConstants.PERSONAL_FOLLOWING_CHANGE_FOLLOW_USER]: (state, { userId, isFollowing }) => ({
    ...state,
    following: changeFollowUtil({ list: state.following, userId, isFollowing }),
  }),
});

const FriendsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default FriendsReducer;
