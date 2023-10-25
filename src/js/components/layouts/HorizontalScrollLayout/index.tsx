import type { MouseEventHandler, PropsWithChildren } from 'react';
import { useCallback, useRef, useState } from 'react';

import classNames from 'classnames';
import { Scrollbar } from 'react-scrollbars-custom';

import styles from './styles.module.scss';

type HorizontalScrollLayoutProps = PropsWithChildren & {
  className?: string;
  contentClassName?: string;
  scrollClassName?: string;
  onScroll?: () => void;
  beforeScrollContent?: () => JSX.Element;
};

function HorizontalScrollLayout({
  onScroll,

  className,
  contentClassName,
  scrollClassName,

  beforeScrollContent,

  children,
}: HorizontalScrollLayoutProps) {
  const scrollRef = useRef<Scrollbar>(null);

  const [dragging, setDragging] = useState(false);
  const [lastClientX, setLastClientX] = useState(0);

  const mouseUpHandle = () => {
    if (!dragging) {
      return;
    }

    setDragging(false);
  };

  const mouseMoveHandle = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (!dragging || !scrollRef.current) {
        return;
      }

      scrollRef.current.scrollTo(scrollRef.current.getScrollState().scrollLeft - (-lastClientX + e.clientX));

      setLastClientX(e.clientX);
    },
    [dragging, lastClientX]
  );

  const mouseDownHandle = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (dragging) {
        return;
      }

      e.preventDefault();
      setLastClientX(e.clientX);

      setDragging(true);
    },
    [dragging]
  );

  return (
    <div
      className={classNames([styles.horizontalScrollLayout, className])}
      onMouseUp={mouseUpHandle}
      onMouseMove={mouseMoveHandle}
      onMouseLeave={mouseUpHandle}
    >
      {beforeScrollContent && beforeScrollContent()}
      <Scrollbar
        // @ts-ignore
        ref={scrollRef}
        className={classNames([styles.horizontalScrollLayout__scroll, scrollClassName])}
        noScrollY
        onScroll={onScroll}
        disableTracksWidthCompensation
      >
        <div className={classNames([styles.horizontalScrollLayout__content, contentClassName])} onMouseDown={mouseDownHandle}>
          {children}
        </div>
      </Scrollbar>
    </div>
  );
}

export default HorizontalScrollLayout;
