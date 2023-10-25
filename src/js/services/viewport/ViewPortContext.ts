import type { Context } from 'react';
import { createContext } from 'react';

import type { ViewportData } from '@/hooks/viewport/ViewportHook';

const ViewPortContext = (() => {
  let context: Context<ViewportData>;

  const init = (viewportData: ViewportData) => createContext(viewportData);

  return {
    get: () => context,
    init: (options: ViewportData) => {
      context = init(options);
    },
  };
})();

export default ViewPortContext;
