import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import NextRouter from '@/services/NextRouter';

export const removeShowErrorQueryUtil = () => {
  const { router = {}, router: { query = {} } = {} } = NextRouter.getInstance();

  if (!isEmpty(query) && query['show-error']) {
    const newQuery = cloneDeep(query);
    delete newQuery['show-error'];

    router.replace({ query: { ...newQuery } }, undefined, { shallow: true }).then();
  }
};
