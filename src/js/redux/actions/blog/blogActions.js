import qs from 'qs';

import api from '@/api';
import { BlogActionsConstants } from '@/constants/actions/blog/blog';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const loadBlogInProcessAction = (loadBlogInProcess) =>
  createAction(BlogActionsConstants.LOAD_BLOG_IN_PROCESS, {
    loadBlogInProcess,
  });

const loadBlogSuccessAction = (params) =>
  createAction(BlogActionsConstants.LOAD_BLOG_SUCCESS, {
    ...params,
  });

export const loadBlogRequestAction = ({ size = 6, type, withoutSave, pageNumber, cookie, dispatch }) =>
  new Promise((resolve) => {
    const { store } = ReduxStoreService.getInstance();

    const { blogListPageSettings: { currentNumber } = {} } = store.getState().BlogReducer || {};

    dispatch(loadBlogInProcessAction(true));

    api
      .get('articles', {
        params: {
          size,
          page: pageNumber || pageNumber === 0 ? pageNumber : currentNumber,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: blogList = [], payload: { page: blogListPageSettings } = {} } = {} }) => {
        dispatch(loadBlogSuccessAction({ withoutSave, blogList, blogListPageSettings, type }));

        resolve({ list: blogList, pageSettings: blogListPageSettings });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadBlogInProcessAction(false));

        resolve(errorData);
      });
  });

const loadBlogItemInProcessAction = ({ slug, flag }) =>
  createAction(BlogActionsConstants.LOAD_BLOG_ITEM_IN_PROCESS, {
    slug,
    flag,
  });

const loadBlogItemSuccessAction = ({ blogItem }) =>
  createAction(BlogActionsConstants.LOAD_BLOG_ITEM_SUCCESS, {
    blogItem,
  });

export const loadBlogItemRequestAction = ({ slug, cookie, dispatch }) =>
  new Promise((resolve) => {
    dispatch(loadBlogItemInProcessAction({ slug, flag: true }));

    api
      .get(`articles/${slug}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { error, data: blogItem = {} } = {} }) => {
        dispatch(loadBlogItemSuccessAction({ blogItem }));

        resolve({ data: blogItem, error });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadBlogItemInProcessAction({ slug, flag: false }));

        resolve(errorData);
      });
  });

const loadBlogItemRelatedArticlesInProcessAction = ({ articleId, flag }) =>
  createAction(BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_ARTICLES_IN_PROCESS, {
    articleId,
    flag,
  });

const loadBlogItemRelatedArticlesSuccessAction = ({ articleId, blogItemRelatedArticles }) =>
  createAction(BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_ARTICLES_SUCCESS, {
    articleId,
    blogItemRelatedArticles,
  });

export const loadBlogItemRelatedArticlesRequestAction = ({ articleId, cookie, dispatch }) =>
  new Promise((resolve) => {
    dispatch(loadBlogItemRelatedArticlesInProcessAction({ articleId, flag: true }));

    api
      .get(`articles/${articleId}/related/articles`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: blogItemRelatedArticles = [] } = {} }) => {
        dispatch(loadBlogItemRelatedArticlesSuccessAction({ articleId, blogItemRelatedArticles }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadBlogItemRelatedArticlesInProcessAction({ articleId, flag: false }));

        resolve(errorData);
      });
  });

const loadBlogItemRelatedProjectsInProcessAction = ({ articleId, flag }) =>
  createAction(BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_PROJECTS_IN_PROCESS, {
    articleId,
    flag,
  });

const loadBlogItemRelatedProjectsSuccessAction = ({ articleId, blogItemRelatedProjects }) =>
  createAction(BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_PROJECTS_SUCCESS, {
    articleId,
    blogItemRelatedProjects,
  });

export const loadBlogItemRelatedProjectsRequestAction = ({ articleId, cookie, dispatch }) =>
  new Promise((resolve) => {
    dispatch(loadBlogItemRelatedProjectsInProcessAction({ articleId, flag: true }));

    api
      .get(`articles/${articleId}/related/projects`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: blogItemRelatedProjects = [] } = {} }) => {
        dispatch(loadBlogItemRelatedProjectsSuccessAction({ articleId, blogItemRelatedProjects }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadBlogItemRelatedProjectsInProcessAction({ articleId, flag: false }));

        resolve(errorData);
      });
  });
