import { DataForProjectActionsConstants } from '@/constants/actions/projects/dataForProject';
import { ProjectDefaultConditionConstants } from '@/constants/projects/conditions';
import { conditionOptionUtil } from '@/utils/project/conditionsUtil';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadArtistsInProcess: false,
  artistsList: [],

  loadLabelsInProcess: false,
  labelsList: [],

  loadGenresInProcess: false,
  genresList: [],

  loadStylesInProcess: false,
  firstStylesList: [],
  stylesList: [],

  loadConditionsInProcess: false,
  loadedConditionsListFromApi: false,
  mediaCondition: [],
  sleeveCondition: [],

  loadGenresAndStylesInProcess: false,
  genresAndStyles: [],

  loadPopularGenresAndStylesInProcess: false,
  popularGenresAndStyles: [],
};

const handlers = createHandlers({
  [DataForProjectActionsConstants.LOAD_ARTISTS_IN_PROCESS]: (state, { loadArtistsInProcess }) => ({
    ...state,
    loadArtistsInProcess,
  }),
  [DataForProjectActionsConstants.LOAD_ARTISTS_SUCCESS]: (state, { artistsList }) => ({
    ...state,
    artistsList,
    loadArtistsInProcess: false,
  }),

  [DataForProjectActionsConstants.LOAD_LABELS_IN_PROCESS]: (state, { loadLabelsInProcess }) => ({
    ...state,
    loadLabelsInProcess,
  }),
  [DataForProjectActionsConstants.LOAD_LABELS_SUCCESS]: (state, { labelsList }) => ({
    ...state,
    labelsList,
    loadLabelsInProcess: false,
  }),

  [DataForProjectActionsConstants.LOAD_GENRES_SUCCESS]: (state, { genresList }) => ({
    ...state,
    genresList,
    loadGenresInProcess: false,
  }),
  [DataForProjectActionsConstants.LOAD_GENRES_IN_PROCESS]: (state, { loadGenresInProcess }) => ({
    ...state,
    loadGenresInProcess,
  }),

  [DataForProjectActionsConstants.UPDATE_STYLES]: (state) => ({
    ...state,
    stylesList: state.firstStylesList,
  }),

  [DataForProjectActionsConstants.LOAD_STYLES_IN_PROCESS]: (state, { loadStylesInProcess }) => ({
    ...state,
    loadStylesInProcess,
  }),
  [DataForProjectActionsConstants.LOAD_STYLES_SUCCESS]: (state, { stylesList }) => ({
    ...state,
    stylesList,
    firstStylesList: state.firstStylesList.length <= 0 ? stylesList : state.firstStylesList,
    loadStylesInProcess: false,
  }),

  [DataForProjectActionsConstants.LOAD_CONDITION_IN_PROCESS]: (state, { loadConditionsInProcess }) => ({
    ...state,
    loadConditionsInProcess,
  }),
  [DataForProjectActionsConstants.LOAD_CONDITION_SUCCESS]: (state, { conditionsList = [] }) => {
    const mediaCondition = [];
    const sleeveCondition = [];

    conditionsList.forEach((conditionItem) => {
      const { id, title, shortTitle, sleeve, media } = conditionItem;

      const conditionOption = conditionOptionUtil({
        id,
        title,
        shortTitle,
      });

      if (media) {
        mediaCondition.push(conditionOption);
      }

      if (sleeve) {
        sleeveCondition.push(conditionOption);
      }
    });

    return {
      ...state,
      sleeveCondition: [ProjectDefaultConditionConstants, ...sleeveCondition],
      mediaCondition: [ProjectDefaultConditionConstants, ...mediaCondition],
      loadConditionsInProcess: false,
      loadedConditionsListFromApi: true,
    };
  },

  [DataForProjectActionsConstants.LOAD_GENRES_AND_STYLES_IN_PROCESS]: (state, { loadGenresAndStylesInProcess }) => ({
    ...state,
    loadGenresAndStylesInProcess,
  }),
  [DataForProjectActionsConstants.LOAD_GENRES_AND_STYLES_SUCCESS]: (state, { genresAndStyles }) => ({
    ...state,
    genresAndStyles,
    loadGenresAndStylesInProcess: false,
  }),
  [DataForProjectActionsConstants.LOAD_POPULAR_GENRES_AND_STYLES_IN_PROCESS]: (
    state,
    { loadPopularGenresAndStylesInProcess }
  ) => ({
    ...state,
    loadPopularGenresAndStylesInProcess,
  }),
  [DataForProjectActionsConstants.LOAD_POPULAR_GENRES_AND_STYLES_SUCCESS]: (state, { popularGenresAndStyles }) => ({
    ...state,
    popularGenresAndStyles,
    loadPopularGenresAndStylesInProcess: false,
  }),
});

const DataForProjectReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default DataForProjectReducer;
