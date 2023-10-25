import api from '@/api';
import { AuthActionsConstants } from '@/constants/actions/auth/auth';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { RoutePathsConstants } from '@/constants/routes/routes';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import NextRouter from '@/services/NextRouter';
import { analyticsSignUpEventPush } from '@/utils/analytics/analyticsPushers';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { logOutUtil } from '@/utils/auth/logOutUtil';
import { removeCookieUtil, setCookieUtil } from '@/utils/cookiesUtil';

import createAction from '../actionCreator';
import { changeGlobalLanguageAction } from '../common/globalActions';

const authRedirectorCall = ({ isPushToPersonal = false } = {}) => {
  const { router } = NextRouter.getInstance();
  const { authRedirector } = AuthRedirectorService.getInstance();

  if (authRedirector) {
    AuthRedirectorService.callAuthRedirector();
  } else if (isPushToPersonal) {
    router.push(RoutePathsConstants.MAIN).then();
  }
};

export const changeUserInfoAction = (userInfo) =>
  createAction(AuthActionsConstants.CHANGE_USER_INFO, {
    userInfo,
  });

export const updateUserInfoAction = (userInfo) =>
  createAction(AuthActionsConstants.UPDATE_USER_INFO, {
    userInfo,
  });

export const removeUserInfoSocialAction = (socialName) =>
  createAction(AuthActionsConstants.REMOVE_USER_INFO_SOCIAL, {
    socialName,
  });

const signUpInProcessAction = (signUpInProcess) =>
  createAction(AuthActionsConstants.SIGN_UP_IN_PROCESS, {
    signUpInProcess,
  });

const signUpSuccessAction = (params) => createAction(AuthActionsConstants.SIGN_UP_SUCCESS, params);

const signUpFailedAction = () => createAction(AuthActionsConstants.SIGN_UP_FAILED);

const signInWithCookieSuccessAction = (userInfo) =>
  createAction(AuthActionsConstants.SIGN_IN_WITH_COOKIE_SUCCESS, {
    userInfo,
  });

const signInWithCookieFailedAction = () => createAction(AuthActionsConstants.SIGN_IN_WITH_COOKIE_FAILED);

const signOutAction = () => createAction(AuthActionsConstants.SIGN_OUT);

const signInWithPasswordInProcessAction = (signInWithPasswordInProcess) =>
  createAction(AuthActionsConstants.SIGN_IN_WITH_PASSWORD_IN_PROCESS, {
    signInWithPasswordInProcess,
  });

const signInWithPasswordFailedAction = () => createAction(AuthActionsConstants.SIGN_IN_WITH_PASSWORD_FAILED);

const signInWithPasswordSuccessAction = (userInfo) =>
  createAction(AuthActionsConstants.SIGN_IN_WITH_PASSWORD_SUCCESS, {
    userInfo,
  });

export const signUpRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { email } = params;

    dispatch(signUpInProcessAction(true));

    api
      .post('auth', params)
      .then(() => {
        dispatch(signUpSuccessAction({ email }));

        removeCookieUtil(CommonVariablesConstants.REFERRAL_CODE);

        analyticsSignUpEventPush();

        authRedirectorCall({ isPushToPersonal: true });

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        const { payload } = error;

        dispatch(signUpFailedAction());

        reject(errorData, payload);
      });
  });

export const signInWithCookieAction =
  ({ cookie, ip }) =>
  (dispatch) =>
    new Promise((resolve) => {
      api('auth', {
        headers: {
          [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie || '',
          'x-front-client-ip': ip || '',
        },
      })
        .then(({ headers, data: { data: userInfo = {} } = {} }) => {
          dispatch(signInWithCookieSuccessAction(userInfo));

          resolve({
            tokenInfo: headers[CommonVariablesConstants.TOKEN_INFO_HELPER_HEAD],
          });
        })
        .catch((error) => {
          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
          dispatch(signInWithCookieFailedAction());
          resolve(errorData);
        });
    });

export const signInWithPasswordRequestAction = (email, password) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(signInWithPasswordInProcessAction(true));

    api
      .put('auth', {
        email,
        password,
      })
      .then(
        ({
          headers: { [CommonVariablesConstants.TOKEN_INFO_HELPER_HEAD]: tokenInfo } = {},
          data: { data: userInfo = {}, date: { language } = {} } = {},
        }) => {
          if (process.env.NEXT_STATIC_BUILD_PROFILE === 'local') {
            const { name, value, maxAge } = JSON.parse(atob(tokenInfo, 'base64'));

            setCookieUtil(name, value, { maxAge });
          }

          dispatch(signInWithPasswordSuccessAction(userInfo));
          dispatch(changeGlobalLanguageAction(language || null, false));

          authRedirectorCall({ isPushToPersonal: true });

          resolve();
        }
      )
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(signInWithPasswordFailedAction());
        reject(errorData);
      });
  });

export const signOutRequestAction =
  ({ withRequest = true }) =>
  (dispatch) => {
    const logOut = () => {
      dispatch(signOutAction());

      logOutUtil({ dispatch });
    };

    if (withRequest) {
      api
        .delete('auth')
        .then(() => {
          logOut();
        })
        .catch(() => {
          logOut();
        });
    } else {
      logOut();
    }
  };
