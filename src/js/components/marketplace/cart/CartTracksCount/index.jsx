import classNames from 'classnames';

import { textForLotsOfUtil } from '@/utils/textUtils';

function CartTracksCount({ count, type = 'FLAC', className, countClassName }) {
  return (
    <span className={classNames(className)}>
      {type}
      &nbsp;
      <span className={classNames(countClassName)}>
        {count} {textForLotsOfUtil(count, ['track', 'tracks'])}
      </span>
    </span>
  );
}

export default CartTracksCount;
