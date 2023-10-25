import { useEffect, useRef, useState } from 'react';

import Preloader from '@/components/ui/Preloader';
import ComponentsCommonConstants from '@/constants/components/common';
import { InfinityScrollHook } from '@/hooks/scroll/InfinityScrollHook';

import styles from './styles.module.scss';

function InfinityScrollLayout({
  isInProcess,
  pageSettings: { currentNumber = 0, totalPages = 0 } = {},
  request,
  requestCallback,
  disabled,
  location,
  root,
  rootMargin,
  children,
}) {
  const sleep = useRef(null);

  const [inProcess, setInProcess] = useState(isInProcess);

  useEffect(
    () => () => {
      clearTimeout(sleep.current);
    },
    []
  );

  useEffect(() => {
    if (disabled) return;

    if (isInProcess) {
      setInProcess(isInProcess);
    } else {
      clearTimeout(sleep.current);

      sleep.current = setTimeout(() => {
        setInProcess(isInProcess);
      }, 500);
    }
  }, [disabled, isInProcess]);

  const hasMoreNext = !isInProcess && currentNumber + 1 < totalPages;

  const infinityScrollRef = InfinityScrollHook({
    request,
    requestCallback,
    currentNumber,
    hasMoreNext,
    isInProcess: inProcess,
    disabled,
    root,
    rootMargin,
    location,
  });

  return (
    <>
      {children}
      {!disabled && (
        <>
          <Preloader
            isShown={isInProcess}
            type="element"
            size={ComponentsCommonConstants.Size.SMALL}
            withOffsets={false}
            className={styles.infinityScroll__preloaderProcess}
          />
          <div ref={infinityScrollRef} className={styles.infinityScroll__trigger} style={{ background: 'transparent' }} />
        </>
      )}
    </>
  );
}

export default InfinityScrollLayout;
