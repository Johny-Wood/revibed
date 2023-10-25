import api from '@/api';
import { GlobalActionsConstants } from '@/constants/actions/common/global';
import ReduxStoreService from '@/services/ReduxStoreService';

import createAction from '../actionCreator';

const loadLanguagesInProcessAction = (loadLanguagesInProcess) =>
  createAction(GlobalActionsConstants.LOAD_LANGUAGES_IN_PROCESS, {
    loadLanguagesInProcess,
  });

const loadLanguagesSuccessAction = (languagesList, detectedLanguage) =>
  createAction(GlobalActionsConstants.LOAD_LANGUAGES_SUCCESS, {
    languagesList,
    detectedLanguage,
  });

const globalChangeLanguage = (language) =>
  createAction(GlobalActionsConstants.CHANGE_LANGUAGE, {
    language,
  });

const loadCountriesInProcessAction = (loadCountriesInProcess) =>
  createAction(GlobalActionsConstants.LOAD_COUNTRIES_IN_PROCESS, {
    loadCountriesInProcess,
  });

const loadCountriesSuccessAction = (countriesList) =>
  createAction(GlobalActionsConstants.LOAD_COUNTRIES_SUCCESS, {
    countriesList,
  });

export const loadLanguagesRequestAction = ({ detectedLanguage, dispatch }) =>
  new Promise((resolve) => {
    dispatch(loadLanguagesInProcessAction(true));

    api
      .get('languages')
      .then(({ data: { data } }) => {
        dispatch(loadLanguagesSuccessAction(data, detectedLanguage));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(loadLanguagesInProcessAction(false));
        resolve();
      });
  });

export const loadCountriesRequestAction = ({ dispatch }) =>
  new Promise((resolve) => {
    dispatch(loadCountriesInProcessAction(true));

    api
      .get('countries')
      .then(({ data: { data } }) => {
        dispatch(loadCountriesSuccessAction(data));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(loadCountriesInProcessAction(false));
        resolve();
      });
  });

export const changeGlobalLanguageAction =
  (language, sendChangeLanguageRequest = true) =>
  (dispatch) =>
    new Promise(() => {
      const { store = {} } = ReduxStoreService.getInstance();
      const { AuthReducer: { userIsAuthorized } = {} } = store.getState();

      if (!language) {
        return;
      }

      dispatch(globalChangeLanguage(language));

      if (sendChangeLanguageRequest && userIsAuthorized) {
        api
          .put('personal/language', {
            languageId: language.id,
          })
          .then(() => {})
          .catch((error) => {
            console.error('Error change language', error);
          });
      }
    });
