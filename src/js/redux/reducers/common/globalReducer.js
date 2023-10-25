import { GlobalActionsConstants } from '@/constants/actions/common/global';

import { createHandlers, createReducer } from '../handler';

const extractInitialSelectedLanguage = ({ detectedLanguage, languagesList }) => {
  if (!languagesList) {
    return {};
  }

  let selectedLanguage;

  if (detectedLanguage) {
    selectedLanguage = languagesList.find(({ language }) => language === detectedLanguage);
  }

  if (!selectedLanguage) {
    selectedLanguage = languagesList.find(({ isDefault }) => isDefault);
  }

  return selectedLanguage || languagesList[0];
};

const initialState = {
  loadLanguagesInProcess: false,
  loadedLanguagesFromApi: false,
  languagesList: [],
  languageSelected: {},

  loadCountriesInProcess: false,
  loadedCountriesFromApi: false,
  countriesList: [],
  countriesSelected: {},
};

const handlers = createHandlers({
  [GlobalActionsConstants.LOAD_LANGUAGES_IN_PROCESS]: (state, { loadLanguagesInProcess }) => ({
    ...state,
    loadLanguagesInProcess,
  }),
  [GlobalActionsConstants.LOAD_LANGUAGES_SUCCESS]: (state, { languagesList, detectedLanguage }) => ({
    ...state,
    loadLanguagesInProcess: false,
    loadedLanguagesFromApi: true,
    languageSelected: extractInitialSelectedLanguage({
      detectedLanguage,
      languagesList,
    }),
    languagesList,
  }),
  [GlobalActionsConstants.CHANGE_LANGUAGE]: (state, { language }) => ({
    ...state,
    languageSelected: language,
  }),

  [GlobalActionsConstants.LOAD_COUNTRIES_IN_PROCESS]: (state, { loadCountriesInProcess }) => ({
    ...state,
    loadCountriesInProcess,
  }),
  [GlobalActionsConstants.LOAD_COUNTRIES_SUCCESS]: (state, { countriesList }) => ({
    ...state,
    loadCountriesInProcess: false,
    loadedCountriesFromApi: true,
    countriesSelected: countriesList[0],
    countriesList,
  }),
});

const GlobalReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default GlobalReducer;
