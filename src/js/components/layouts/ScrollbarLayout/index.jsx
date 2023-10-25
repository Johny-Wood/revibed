import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { Scrollbar } from 'react-scrollbars-custom';

import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

function ScrollbarLayout({ className, contentLength, width = '100%', maxHeight, height, children }) {
  const { isNotDesktop } = ViewportHook();

  const contentRef = useRef(null);

  const [clientHeight, setClientHeight] = useState(0);

  useEffect(() => {
    const content = contentRef.current;

    setClientHeight((content && content.clientHeight) || 0);
  }, [contentLength, height]);

  return (
    <Scrollbar
      className={styles.scrollbarLayout}
      mobileNative={isNotDesktop}
      noScrollX
      disableTracksWidthCompensation
      style={{
        width,
        height: height || clientHeight,
        maxHeight,
      }}
    >
      <div ref={contentRef} className={classNames(className)}>
        {children}
      </div>
    </Scrollbar>
  );
}

export default ScrollbarLayout;
