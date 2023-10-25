import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function BorderTopLayout({
  className,

  children,
}) {
  return <div className={classNames(styles.containerBorderTop, className)}>{children}</div>;
}

BorderTopLayout.defaultProps = {
  className: '',
};

BorderTopLayout.propTypes = {
  className: PropTypes.string,
};

export default BorderTopLayout;
