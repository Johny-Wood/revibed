import { useCallback, useEffect, useRef } from 'react';

type RequestData = {
  withoutSave?: boolean;
  infinityScroll?: boolean;
  setProjectPosition?: 'LAST' | 'FIRST';
  pageNumber?: number;
  location?: string;
  savePageSettings?: boolean;
};

type InfinityScrollHookData = {
  request: (data: RequestData) => Promise<unknown>;
  requestCallback: (data: unknown) => void;
  currentNumber: number;
  inProcess: boolean;
  hasMoreNext: boolean;
  disabled?: boolean;
  location?: string;
  root?: string;
  rootMargin?: string;
};

export function InfinityScrollHook({
  location,
  request,
  currentNumber,
  requestCallback,
  hasMoreNext: hasMore,
  inProcess,
  disabled,
  root,
  rootMargin,
}: InfinityScrollHookData) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const intersectionCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore) {
          if (!inProcess) {
            const config: RequestData = {
              withoutSave: true,
              infinityScroll: true,
              setProjectPosition: 'LAST',
              pageNumber: currentNumber + 1,
              savePageSettings: true,
              location,
            };

            request(config).then(requestCallback);
          }
        }
      });
    },
    [currentNumber, hasMore, inProcess, location, request, requestCallback]
  );

  useEffect(() => {
    const options = {
      root: root ? document.querySelector(root) : null,
      rootMargin,
      threshold: 1.0,
    };

    const observer = !disabled ? new IntersectionObserver(intersectionCallback, options) : null;

    if (sentinelRef.current && observer) {
      observer.observe(sentinelRef.current);
    }

    const sentinelRefTmp = sentinelRef.current;

    return () => {
      if (sentinelRefTmp && !disabled && observer) {
        observer.unobserve(sentinelRefTmp);
      }
    };
  }, [disabled, intersectionCallback, root, rootMargin]);

  return sentinelRef;
}
