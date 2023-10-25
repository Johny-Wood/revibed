import type { Context } from 'react';
import { createContext } from 'react';

import type { TranslateData } from '@/hooks/translate/TranslateHook';

const TranslateProviderContext = (() => {
  let context: Context<TranslateData>;

  const init = (language: TranslateData) => createContext(language);

  return {
    get: () => context,
    init: (language: TranslateData) => {
      context = init(language);
    },
  };
})();

export default TranslateProviderContext;
