import classNames from 'classnames';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';

import GemIcon from '@/icons/GemIcon';

import styles from './styles.module.scss';

function Gem({ size, offset, color, afterText, className }) {
  return (
    <span className={classNames('gem i-f_y-center', styles.gem, className)}>
      <GemIcon className="gem-icon" size={size} offset={offset} color={color} />
      {parse(afterText)}
    </span>
  );
}

Gem.defaultProps = {
  size: undefined,
  offset: false,
  color: undefined,
  afterText: '',
  className: '',
};

Gem.propTypes = {
  size: PropTypes.number,
  offset: PropTypes.bool,
  color: PropTypes.string,
  afterText: PropTypes.string,
  className: PropTypes.string,
};

export default Gem;
