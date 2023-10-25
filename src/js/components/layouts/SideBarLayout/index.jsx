import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function SideBarLayout({
  withMarginBottomMinus,
  className,

  children,
}) {
  return (
    <aside className={classNames([styles.sideBar, withMarginBottomMinus && styles.sideBar_bottom_minus, className])}>
      {children}
    </aside>
  );
}

SideBarLayout.defaultProps = {
  withMarginBottomMinus: false,

  className: '',
};

SideBarLayout.propTypes = {
  withMarginBottomMinus: PropTypes.bool,

  className: PropTypes.string,
};

export default SideBarLayout;
