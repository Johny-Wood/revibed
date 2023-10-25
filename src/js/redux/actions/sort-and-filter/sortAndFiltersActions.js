import qs from 'qs';

import api from '@/api';
import { SortAndFiltersActionsConstants } from '@/constants/actions/projects/sortAndFilters';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const getSortAndFiltersInProcessAction = (location, loadSortAndFiltersInProcess) =>
  createAction(`${location}_${SortAndFiltersActionsConstants.GET_SORT_AND_FILTERS_IN_PROCESS}`, {
    loadSortAndFiltersInProcess,
  });

const getSortAndFiltersSuccessAction = (location, sortAndFilters) =>
  createAction(`${location}_${SortAndFiltersActionsConstants.GET_SORT_AND_FILTERS_SUCCESS}`, {
    sortAndFilters,
  });

export const resetSortAndFilterAction = (location) =>
  createAction(`${location}_${SortAndFiltersActionsConstants.RESET_SORT_AND_FILTERS}`);

export const getSortAndFiltersRequestAction = ({ location, cookie, query = {}, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getSortAndFiltersInProcessAction(location, true));

    api
      .get(`sort-and-filter/${location}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          ...query,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: sortAndFilters = {} } = {} }) => {
        dispatch(getSortAndFiltersSuccessAction(location, sortAndFilters));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(getSortAndFiltersInProcessAction(location, false));

        reject(errorData);
      });
  });
