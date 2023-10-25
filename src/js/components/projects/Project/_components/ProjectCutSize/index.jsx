import classNames from 'classnames';
import PropTypes from 'prop-types';

import Coin from '@/components/ui/currency/Coin';
import { floatWithCommaFixedUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ProjectCutSize({
  size,
  count,
  hideCut,
  withDescription,

  className,
  descriptionClassName,
  valueClassName,
}) {
  return (
    <div className={styles.projectCutSize}>
      {!hideCut && (
        <div className={classNames(styles.projectCutSize__block, className)}>
          <span className={classNames(descriptionClassName)}>
            <Coin>
              {!!count && withDescription && (
                <>
                  {count}
                  &nbsp;
                  {textForLotsOfUtil(count, ['cut', 'cuts'])}
                  :&nbsp;
                </>
              )}
              <span className={classNames(valueClassName)}>{floatWithCommaFixedUtil(size)}</span>
            </Coin>
          </span>
        </div>
      )}
    </div>
  );
}

ProjectCutSize.defaultProps = {
  size: 0,
  count: 1,
  hideCut: false,
  withDescription: false,

  className: null,
  descriptionClassName: null,
  valueClassName: null,
};

ProjectCutSize.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  count: PropTypes.number,
  hideCut: PropTypes.bool,
  withDescription: PropTypes.bool,

  className: PropTypes.string,
  descriptionClassName: PropTypes.string,
  valueClassName: PropTypes.string,
};

export default ProjectCutSize;
