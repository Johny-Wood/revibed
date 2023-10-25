import api from '@/api';
import { SocialConnectActionsConstants } from '@/constants/actions/socialConnect';

import createAction from './actionCreator';
import { changeUserInfoAction, removeUserInfoSocialAction } from './auth/authActions';

const discogsSocialConnectGenerateUriInProcessAction = (discogsSocialConnectGenerateRedirectUrlInProcess) =>
  createAction(SocialConnectActionsConstants.DISCOGS_SOCIAL_CONNECT_GENERATE_URL_IN_PROCESS, {
    discogsSocialConnectGenerateRedirectUrlInProcess,
  });

const discogsSocialConnectInProcessAction = (discogsSocialConnectInProcess) =>
  createAction(SocialConnectActionsConstants.DISCOGS_SOCIAL_CONNECT_IN_PROCESS, {
    discogsSocialConnectInProcess,
  });

const discogsSocialDisconnectInProcessAction = (discogsSocialDisconnectInProcess) =>
  createAction(SocialConnectActionsConstants.DISCOGS_SOCIAL_DISCONNECT_IN_PROCESS, {
    discogsSocialDisconnectInProcess,
  });

const inProcessActionCreator = {
  discogs: {
    generateUri: discogsSocialConnectGenerateUriInProcessAction,
    connect: discogsSocialConnectInProcessAction,
  },
};

const extractInProcessMethod = ({ socialType, methodName }) => {
  const creator = inProcessActionCreator[socialType];

  if (!creator) {
    throw new Error(`Unsupported social type ${socialType}`);
  }

  return creator[methodName];
};

const generateUriInProcessAction = ({ socialType, inProcess }) =>
  extractInProcessMethod({
    socialType,
    methodName: 'generateUri',
  })(inProcess);

const generateConnectInProcessAction = ({ socialType, inProcess }) =>
  extractInProcessMethod({
    socialType,
    methodName: 'connect',
  })(inProcess);

export const socialConnectGenerateRedirectUriRequestAction =
  ({ socialType, payloadQuery }) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(generateUriInProcessAction({ socialType, inProcess: true }));

      api
        .put(`personal/social-connect/${socialType}`, {
          payload: payloadQuery,
        })
        .then(({ data: { data: { redirectUrl } = {} } = {} }) => {
          resolve({ redirectUrl });
        })
        .catch(() => {
          dispatch(generateUriInProcessAction({ socialType, inProcess: false }));
        });
    });

export const socialConnectRequestAction =
  ({ socialType, code }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(generateConnectInProcessAction({ socialType, inProcess: true }));

      api
        .post(`personal/social-connect/${socialType}`, { code })
        .then(({ data: { data } = {} }) => {
          dispatch(changeUserInfoAction(data));

          dispatch(generateConnectInProcessAction({ socialType, inProcess: false }));

          resolve();
        })
        .catch(() => {
          dispatch(generateConnectInProcessAction({ socialType, inProcess: false }));

          reject();
        });
    });

export const socialDisconnectRequestAction =
  ({ socialType }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(discogsSocialDisconnectInProcessAction(true));

      api
        .delete(`personal/social-connect/${socialType}`)
        .then(() => {
          dispatch(removeUserInfoSocialAction(socialType));
          dispatch(discogsSocialDisconnectInProcessAction(false));

          resolve();
        })
        .catch(() => {
          dispatch(discogsSocialDisconnectInProcessAction(false));

          reject();
        });
    });
