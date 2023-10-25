import cloneDeepWith from 'lodash/cloneDeepWith';
import isString from 'lodash/isString';

import NextRouter from '@/services/NextRouter';

export const setQueryPageParamsUtil = ({
  filtersQuery = {},
  sortQuery = {},
  pageSize = 25,
  pageNumber = 0,

  shallow = true,
  callback = () => {},
} = {}) => {
  const { router } = NextRouter.getInstance();

  if (!router?.router) {
    return;
  }

  const query = {
    ...filtersQuery,
    ...sortQuery,
    size: pageSize,
    page: pageNumber,
  };

  const dynamicPathParamsRegexp = /\[([^\]]*)]/g;
  const matches = (router.router.pathname.match(dynamicPathParamsRegexp) || []).map((match) =>
    match.replace(dynamicPathParamsRegexp, '$1')
  );
  const { player } = router.router.query || {};

  delete query.unreadable;

  matches.forEach((match) => {
    query[match] = router.router.query[match];
  });

  router
    .replace(
      {
        pathname: router.router.pathname,
        query: !player
          ? {
              ...query,
            }
          : {
              ...query,
              player,
            },
      },
      undefined,
      {
        shallow,
      }
    )
    .then(callback);
};

export const getQueryPageParamsUtil = ({ query = {} } = {}) => {
  const { page: pageNumber, size: pageSize, sort = {}, ...restParams } = query;

  // eslint-disable-next-line consistent-return
  const pageFilters = cloneDeepWith(restParams, (value) => {
    if (isString(value)) {
      return [value];
    }
  });

  return {
    pageNumber,
    pageSize,
    pageSort: {
      sort,
    },
    pageFilters,
  };
};

export const redirectPageUtil = ({ location, req, res }) => {
  if (req) {
    res.statusCode = 302;
    res.setHeader('Location', location);
    res.end();
  } else {
    const { router = {} } = NextRouter.getInstance();
    router.push(location);
  }
};
