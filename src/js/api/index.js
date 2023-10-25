import axiosBase from 'axios';

import { PopupCommonIdsConstants, PopupProjectIdsConstants, PopupRipperIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { logOutUtil } from '@/utils/auth/logOutUtil';

import ripperUseCoinsAllowedRequests from './conditional-requests/ripperUseCoinsAllowedRequests';

const api = axiosBase.create({
  baseURL: `${process.env.NEXT_STATIC_API_URL}`,
  withCredentials: true,
});

const showRipperUseCoinsAllowedPopup = () => {
  const { store } = ReduxStoreService.getInstance();

  store.dispatch(showPopupAction(PopupRipperIdsConstants.RipperUseCoinsAllowedPopup));
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response: { status } = {} } = error;
    const { data: { error: errorMessage } = {} } = extractErrorDataFromResponseApiUtil(error);
    const { store } = ReduxStoreService.getInstance();

    if (axiosBase.isCancel(error) || !status) {
      return Promise.reject(error);
    }

    if (['API_ERROR', 'INTERNAL_ERROR', 'ILLEGAL_ARGUMENT'].includes(errorMessage)) {
      store.dispatch(showPopupAction(PopupCommonIdsConstants.DefaultWarningPopup));

      return Promise.reject(error);
    }

    if (['CREATE_PROJECTS_NOT_ALLOWED'].includes(errorMessage)) {
      store.dispatch(showPopupAction(PopupProjectIdsConstants.CreateProjectsDisabledPopup));

      return Promise.reject(error);
    }

    if (['RIPPER_USE_COINS_NOT_ALLOWED'].includes(errorMessage)) {
      showRipperUseCoinsAllowedPopup();

      return Promise.reject(error);
    }

    if (['PROJECT_STATUS_WRONG'].includes(errorMessage)) {
      store.dispatch(
        showMessageAction('ErrorMessage', {
          messageText: 'Project status wrong',
        })
      );

      return Promise.reject(error);
    }

    if (status === 401) {
      logOutUtil({ dispatch: store.dispatch });

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const { method, url } = config;
    const { store } = ReduxStoreService.getInstance();
    const { AuthReducer: { userInfo: { ripperUseCoinsAllowed = true } = {} } = {} } = store.getState();

    const findripperUseCoinsAllowedRequest =
      ripperUseCoinsAllowedRequests.findIndex(
        ({ url: requestUrl = '', method: requestMethod = '', urlPattern: requestUrlPattern = '' }) =>
          requestMethod === method && (requestUrlPattern ? requestUrlPattern.test(url) : requestUrl === url)
      ) > -1;

    if (findripperUseCoinsAllowedRequest && !ripperUseCoinsAllowed) {
      showRipperUseCoinsAllowedPopup();

      return Promise.reject();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
