import classNames from 'classnames';
import PropTypes from 'prop-types';

import Coin from '@/components/ui/currency/Coin';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ProjectCollected({
  cutsCount,
  amount,
  withCaption,
  withFounded,
  withAmount,
  withShipping,
  sizeCoin = 12,
  disabled = false,
  className,
  valueClassName,
}) {
  return (
    <div className={classNames([styles.projectCollected, disabled && 'c-gray-3', className])}>
      {withCaption && <span className="c-gray-2">collected:&nbsp;</span>}
      <span className={classNames([valueClassName])}>
        {!!cutsCount && <b>{cutsCount}%</b>}
        {!!cutsCount && !!withFounded && <span>&nbsp;funded</span>}
        {!!withAmount && (
          <>
            &nbsp;of&nbsp;
            <Coin size={sizeCoin} color={!disabled ? 'black' : 'gray-3'}>
              {floatWithCommaFixedUtil(amount)}
            </Coin>
          </>
        )}
      </span>
      {withShipping && <span className={classNames([styles.projectCollected__shipping, 'c-gray-2'])}>&nbsp;+&nbsp;shipping</span>}
    </div>
  );
}

ProjectCollected.defaultProps = {
  amount: 0,
  withCaption: false,
  withAmount: true,
  withFounded: true,
  disabled: false,
};

ProjectCollected.propTypes = {
  amount: PropTypes.any,
  withCaption: PropTypes.bool,
  withAmount: PropTypes.bool,
  withFounded: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ProjectCollected;
