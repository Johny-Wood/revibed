import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { DataForProjectActionsConstants } from '@/constants/actions/projects/dataForProject';

import createAction from '../actionCreator';

const loadArtistsSuccessAction = (artistsList) =>
  createAction(DataForProjectActionsConstants.LOAD_ARTISTS_SUCCESS, {
    artistsList,
  });

const loadArtistsInProcessAction = (loadArtistsInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_ARTISTS_IN_PROCESS, {
    loadArtistsInProcess,
  });

const loadLabelsSuccessAction = (labelsList) =>
  createAction(DataForProjectActionsConstants.LOAD_LABELS_SUCCESS, {
    labelsList,
  });

const loadLabelsInProcessAction = (loadLabelsInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_LABELS_IN_PROCESS, {
    loadLabelsInProcess,
  });

const loadGenresSuccessAction = (genresList) =>
  createAction(DataForProjectActionsConstants.LOAD_GENRES_SUCCESS, {
    genresList,
  });
const loadGenresInProcessAction = (loadGenresInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_GENRES_IN_PROCESS, {
    loadGenresInProcess,
  });

export const updateStylesSuccessAction = () => createAction(DataForProjectActionsConstants.UPDATE_STYLES);

const loadStylesSuccessAction = (stylesList) =>
  createAction(DataForProjectActionsConstants.LOAD_STYLES_SUCCESS, {
    stylesList,
  });

const loadStylesInProcessAction = (loadStylesInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_STYLES_IN_PROCESS, {
    loadStylesInProcess,
  });

const loadConditionsInProcessAction = (loadConditionsInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_CONDITION_IN_PROCESS, {
    loadConditionsInProcess,
  });

const loadConditionsSuccessAction = (conditionsList) =>
  createAction(DataForProjectActionsConstants.LOAD_CONDITION_SUCCESS, {
    conditionsList,
  });

const loadGenresAndStylesInProcessAction = (loadGenresAndStylesInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_GENRES_AND_STYLES_IN_PROCESS, {
    loadGenresAndStylesInProcess,
  });

const loadGenresAndStylesSuccessAction = (genresAndStyles) =>
  createAction(DataForProjectActionsConstants.LOAD_GENRES_AND_STYLES_SUCCESS, {
    genresAndStyles,
  });

const loadPopularGenresAndStylesInProcessAction = (loadPopularGenresAndStylesInProcess) =>
  createAction(DataForProjectActionsConstants.LOAD_POPULAR_GENRES_AND_STYLES_IN_PROCESS, {
    loadPopularGenresAndStylesInProcess,
  });

const loadPopularGenresAndStylesSuccessAction = (popularGenresAndStyles) =>
  createAction(DataForProjectActionsConstants.LOAD_POPULAR_GENRES_AND_STYLES_SUCCESS, {
    popularGenresAndStyles,
  });

let cancelTokenLoadArtists;
export const loadArtistsRequestAction = (name) => (dispatch) =>
  new Promise((resolve) => {
    if (cancelTokenLoadArtists) {
      cancelTokenLoadArtists.cancel();
    }

    cancelTokenLoadArtists = axios.CancelToken.source();

    dispatch(loadArtistsInProcessAction(true));

    api
      .get('artists', {
        cancelToken: cancelTokenLoadArtists.token,
        params: {
          name,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData } }) => {
        dispatch(loadArtistsSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        dispatch(loadArtistsInProcessAction(axios.isCancel(error)));
      });
  });

let cancelTokenLoadLabels;
export const loadLabelsRequestAction = (name) => (dispatch) =>
  new Promise((resolve) => {
    if (cancelTokenLoadLabels) {
      cancelTokenLoadLabels.cancel();
    }

    cancelTokenLoadLabels = axios.CancelToken.source();

    dispatch(loadLabelsInProcessAction(true));

    api
      .get('labels', {
        cancelToken: cancelTokenLoadLabels.token,
        params: {
          name,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData } }) => {
        dispatch(loadLabelsSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        dispatch(loadLabelsInProcessAction(axios.isCancel(error)));
      });
  });

let cancelTokenLoadGenres;
export const loadGenresRequestAction = (name) => (dispatch) =>
  new Promise((resolve) => {
    if (cancelTokenLoadGenres) {
      cancelTokenLoadGenres.cancel();
    }

    cancelTokenLoadGenres = axios.CancelToken.source();

    dispatch(loadGenresInProcessAction(true));

    api
      .get('genres', {
        cancelToken: cancelTokenLoadGenres.token,
        params: {
          name,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData } }) => {
        dispatch(loadGenresSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        dispatch(loadGenresInProcessAction(axios.isCancel(error)));
      });
  });

let cancelTokenLoadStyles;
export const loadStylesRequestAction = (name) => (dispatch) =>
  new Promise((resolve) => {
    if (cancelTokenLoadStyles) {
      cancelTokenLoadStyles.cancel();
    }

    cancelTokenLoadStyles = axios.CancelToken.source();

    dispatch(loadStylesInProcessAction(true));

    api
      .get('styles', {
        cancelToken: cancelTokenLoadStyles.token,
        params: {
          name,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData } }) => {
        dispatch(loadStylesSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        dispatch(loadStylesInProcessAction(axios.isCancel(error)));
      });
  });

export const loadConditionsRequestAction = ({ dispatch }) =>
  new Promise((resolve) => {
    dispatch(loadConditionsInProcessAction(true));

    api
      .get('conditions')
      .then(({ data: { data: responseData } }) => {
        dispatch(loadConditionsSuccessAction(responseData));

        resolve();
      })
      .catch(() => {
        dispatch(loadConditionsInProcessAction(false));
      });
  });

let cancelTokenLoadGenresAndStyles;
export const loadGenresAndStylesRequestAction = (name) => (dispatch) =>
  new Promise((resolve) => {
    if (cancelTokenLoadGenresAndStyles) {
      cancelTokenLoadGenresAndStyles.cancel();
    }

    cancelTokenLoadGenresAndStyles = axios.CancelToken.source();

    dispatch(loadGenresAndStylesInProcessAction(true));

    api
      .get('styles/favorites', {
        cancelToken: cancelTokenLoadGenresAndStyles.token,
        params: {
          name,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData } }) => {
        dispatch(loadGenresAndStylesSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        dispatch(loadGenresAndStylesInProcessAction(axios.isCancel(error)));
      });
  });

export const loadPopularGenresAndStylesRequestAction = () => (dispatch) =>
  new Promise((resolve) => {
    dispatch(loadPopularGenresAndStylesInProcessAction(true));

    api
      .get('styles/favorites', {
        cancelToken: cancelTokenLoadGenresAndStyles.token,
        params: {
          size: 4,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData } }) => {
        dispatch(loadPopularGenresAndStylesSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        dispatch(loadPopularGenresAndStylesInProcessAction(axios.isCancel(error)));
      });
  });
