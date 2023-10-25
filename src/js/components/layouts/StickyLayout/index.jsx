import PropTypes from 'prop-types';
import Sticky from 'react-sticky-el';

import ViewportHook from '@/hooks/viewport/ViewportHook';
import { covertPx2RemUtil } from '@/utils/covertPx2RemUtil';

function StickyLayout({
  topOffset,
  top,
  className,

  children,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <Sticky
      className={className}
      scrollElement=".ScrollbarsCustom-Scroller"
      topOffset={topOffset}
      stickyStyle={{ top: covertPx2RemUtil(top) }}
      disabled={isNotDesktop}
    >
      {children}
    </Sticky>
  );
}

StickyLayout.defaultProps = {
  topOffset: -30,
  top: 101,
  className: '',
};

StickyLayout.propTypes = {
  topOffset: PropTypes.number,
  top: PropTypes.number,
  className: PropTypes.string,
};

export default StickyLayout;
