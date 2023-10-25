import unset from 'lodash/unset';

import { AuthActionsConstants } from '@/constants/actions/auth/auth';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  userIsAuthorized: false,
  userInfo: {
    wantListSettings: {},
  },

  signUpInProcess: false,
  signUpSuccess: false,
  signUpSuccessEmail: '',
  signInWithCookieInProcess: true,
  signInWithPasswordInProcess: false,
};

const handlers = createHandlers({
  [AuthActionsConstants.UPDATE_USER_INFO]: (state, { userInfo }) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      ...userInfo,
    },
  }),
  [AuthActionsConstants.CHANGE_USER_INFO]: (state, { userInfo }) => ({
    ...state,
    userInfo,
    userIsAuthorized: true,
  }),
  [AuthActionsConstants.REMOVE_USER_INFO_SOCIAL]: (state, { socialName }) => {
    const { userInfo } = state;

    unset(userInfo, `socials.${socialName.toUpperCase()}`);

    return {
      ...state,
      userInfo,
    };
  },
  [AuthActionsConstants.CHANGE_USER_BALANCE]: (state, { balance }) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      balance,
    },
  }),
  [AuthActionsConstants.CHANGE_GEMS_COUNT]: (state, { gemsCount }) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      gemsCount,
    },
  }),
  [AuthActionsConstants.CHANGE_GOLDEN_COINS_COUNT]: (state, { goldenCoinsCount }) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      goldenCoinsCount,
    },
  }),

  [AuthActionsConstants.SIGN_IN_WITH_PASSWORD_SUCCESS]: (state, { userInfo }) => ({
    ...state,
    signInWithPasswordInProcess: false,
    userIsAuthorized: true,
    userInfo,
  }),
  [AuthActionsConstants.SIGN_IN_WITH_PASSWORD_FAILED]: (state) => ({
    ...state,
    signInWithPasswordInProcess: false,
    userIsAuthorized: false,
    userInfo: {},
  }),
  [AuthActionsConstants.SIGN_IN_WITH_PASSWORD_IN_PROCESS]: (state, { signInWithPasswordInProcess }) => ({
    ...state,
    signInWithPasswordInProcess,
  }),

  [AuthActionsConstants.SIGN_IN_WITH_COOKIE_FAILED]: (state) => ({
    ...state,
    signInWithCookieInProcess: false,
    userIsAuthorized: false,
    userInfo: {},
  }),
  [AuthActionsConstants.SIGN_IN_WITH_COOKIE_SUCCESS]: (state, { userInfo }) => ({
    ...state,
    signInWithCookieInProcess: false,
    userIsAuthorized: true,
    userInfo,
  }),

  [AuthActionsConstants.SIGN_UP_FAILED]: (state) => ({
    ...state,
    signUpInProcess: false,
  }),
  [AuthActionsConstants.SIGN_UP_SUCCESS]: (state, { email }) => ({
    ...state,
    signUpInProcess: false,
    signUpSuccess: true,
    signUpSuccessEmail: email,
  }),
  [AuthActionsConstants.SIGN_UP_IN_PROCESS]: (state, { signUpInProcess }) => ({
    ...state,
    signUpInProcess,
  }),

  [AuthActionsConstants.SIGN_OUT]: () => ({
    ...initialState,
    signInWithCookieInProcess: false,
  }),
});

const AuthReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default AuthReducer;
