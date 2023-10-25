import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import ScrollService from '@/services/scroll/ScrollService';

export const HistoryContext = createContext({});

export function HistoryProvider({ children }) {
  const { asPath, push } = useRouter();

  const historyScrollPositionRef = useRef(0);

  const [value, setValue] = useState({
    history: {
      previous: { path: '', scrollPosition: historyScrollPositionRef.current },
      current: { path: '', scrollPosition: historyScrollPositionRef.current },
    },
  });

  const back = useCallback(
    (fallbackRoute, callback) => {
      if (!value.history.previous.path) {
        push(fallbackRoute).then(callback);
      } else {
        push(value.history.previous.path).then(callback);
      }
    },
    [push, value.history.previous.path]
  );

  const setActiveScrollPosition = useCallback(() => {
    setValue(({ history: { previous, current } }) => ({
      history: {
        current,
        previous: {
          path: previous.path,
          scrollPosition: previous.scrollPosition,
          isActive: true,
        },
      },
    }));
  }, []);

  const unsetActiveScrollPosition = useCallback(() => {
    setValue(({ history: { previous, current } }) => ({
      history: {
        previous,
        current: {
          path: current.path,
          scrollPosition: current.scrollPosition,
          isActive: false,
        },
      },
    }));
  }, []);

  useEffect(() => {
    setValue(
      ({
        history: {
          previous: { scrollPosition },
          current: { path, isActive: currentIsActive },
        },
      }) => ({
        history: {
          previous: {
            path,
            scrollPosition: historyScrollPositionRef.current,
            isActive: currentIsActive,
          },
          current: {
            path: asPath,
            scrollPosition,
            isActive: false,
          },
        },
      })
    );

    return () => {
      historyScrollPositionRef.current = ScrollService.getScrollPosition();
    };
  }, [asPath]);

  const valueReturn = useMemo(
    () => ({ ...value, back, setActiveScrollPosition, unsetActiveScrollPosition }),
    [back, setActiveScrollPosition, unsetActiveScrollPosition, value]
  );

  return <HistoryContext.Provider value={valueReturn}>{children}</HistoryContext.Provider>;
}

export function UseHistory() {
  return useContext(HistoryContext);
}
