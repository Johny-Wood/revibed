import classNames from 'classnames';

import InfinityScrollLayout from '@/components/layouts/InfinityScrollLayout';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';

import styles from './styles.module.scss';

function InfinityScrollWithScrollbarLayout({ width, height, contentLength, children, className, ...restProps }) {
  return (
    <div className={classNames(styles.infinityScroll, className)}>
      <ScrollbarLayout width={width} maxHeight={height} contentLength={contentLength}>
        <InfinityScrollLayout {...restProps}>{children}</InfinityScrollLayout>
      </ScrollbarLayout>
    </div>
  );
}

export default InfinityScrollWithScrollbarLayout;
