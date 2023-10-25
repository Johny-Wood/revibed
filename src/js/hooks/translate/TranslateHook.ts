import { useCallback, useContext } from 'react';

import TranslateContext from '@/services/language/TranslateContext';
import { translations } from '@/services/language/translations';

export type TranslateFunction = (key: string | number) => string;

export type TranslateData = string | number;

const TranslateHook = () => {
  const language = useContext(TranslateContext.get());

  // @ts-ignore
  return useCallback<TranslateFunction>(
    (key) => (translations && translations[key] && translations[key][language]) ?? key,
    [language]
  );
};

export default TranslateHook;
