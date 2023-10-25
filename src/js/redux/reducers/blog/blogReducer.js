import { BlogActionsConstants } from '@/constants/actions/blog/blog';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadBlogInProcess: false,
  loadBlogFromApi: false,
  loadShortBlogFromApi: false,
  blogList: [],
  blogListPageSettings: {},

  blogItems: {},
  blogItemsInProcess: {},

  blogItemRelatedArticles: {},
  blogItemRelatedArticlesInProcess: {},

  blogItemRelatedProjects: {},
  blogItemRelatedProjectsInProcess: {},
};

const handlers = createHandlers({
  [BlogActionsConstants.LOAD_BLOG_IN_PROCESS]: (state, { loadBlogInProcess }) => ({
    ...state,
    loadBlogInProcess,
  }),
  [BlogActionsConstants.LOAD_BLOG_SUCCESS]: (state, { withoutSave, blogList, blogListPageSettings, type }) => ({
    ...state,
    blogList: !withoutSave ? blogList : state.blogList,
    loadBlogInProcess: false,
    loadBlogFromApi: type !== 'SHORT',
    loadShortBlogFromApi: type === 'SHORT',
    blogListPageSettings: !withoutSave ? blogListPageSettings : state.blogListPageSettings,
  }),

  [BlogActionsConstants.LOAD_BLOG_ITEM_IN_PROCESS]: (state, { slug, flag }) => ({
    ...state,
    blogItemsInProcess: {
      ...state.blogItemsInProcess,
      [slug]: flag,
    },
  }),
  [BlogActionsConstants.LOAD_BLOG_ITEM_SUCCESS]: (state, { blogItem }) => ({
    ...state,
    blogItems: {
      ...state.blogItems,
      [blogItem.slug]: blogItem,
    },
    blogItemsInProcess: {
      ...state.blogItemsInProcess,
      [blogItem.slug]: false,
    },
  }),

  [BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_ARTICLES_IN_PROCESS]: (state, { articleId, flag }) => ({
    ...state,
    blogItemRelatedArticlesInProcess: {
      ...state.blogItemRelatedArticlesInProcess,
      [articleId]: flag,
    },
  }),
  [BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_ARTICLES_SUCCESS]: (state, { articleId, blogItemRelatedArticles }) => ({
    ...state,
    blogItemRelatedArticles: {
      ...state.blogItemRelatedArticles,
      [articleId]: blogItemRelatedArticles,
    },
    blogItemRelatedArticlesInProcess: {
      ...state.blogItemRelatedArticlesInProcess,
      [articleId]: false,
    },
  }),

  [BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_PROJECTS_IN_PROCESS]: (state, { articleId, flag }) => ({
    ...state,
    blogItemRelatedProjectsInProcess: {
      ...state.blogItemRelatedProjectsInProcess,
      [articleId]: flag,
    },
  }),
  [BlogActionsConstants.LOAD_BLOG_ITEM_RELATED_PROJECTS_SUCCESS]: (state, { articleId, blogItemRelatedProjects }) => ({
    ...state,
    blogItemRelatedProjects: {
      ...state.blogItemRelatedProjects,
      [articleId]: blogItemRelatedProjects,
    },
    blogItemRelatedProjectsInProcess: {
      ...state.blogItemRelatedProjectsInProcess,
      [articleId]: false,
    },
  }),
});

const BlogReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default BlogReducer;
