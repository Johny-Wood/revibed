import api from '@/api';
import { FaqActionsConstants } from '@/constants/actions/faq';

import createAction from '../actionCreator';

export const setFaqActiveCategoryAction = ({ activeCategory, activeTitle }) =>
  createAction(FaqActionsConstants.SET_FAQ_ACTIVE_CATEGORY, {
    activeCategory,
    activeTitle,
  });

const loadFaqInProcessAction = (loadFaqInProcess) =>
  createAction(FaqActionsConstants.LOAD_FAQ_IN_PROCESS, {
    loadFaqInProcess,
  });

const loadFaqSuccessAction = (faqList) =>
  createAction(FaqActionsConstants.LOAD_FAQ_SUCCESS, {
    faqList,
  });

export const loadFaqRequestAction = () => (dispatch) =>
  new Promise((then) => {
    dispatch(loadFaqInProcessAction(true));

    api
      .get('faq')
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(loadFaqSuccessAction(responseData));

        then();
      })
      .catch(() => {
        dispatch(loadFaqInProcessAction(false));

        then();
      });
  });
