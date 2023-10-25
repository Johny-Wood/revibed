import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function FormLocalGroupLayout({ title, isDisabled, titleClassName, children }) {
  return (
    <div className={styles.formLocalGroup}>
      <div
        className={classNames(styles.formLocalGroup__title, isDisabled && styles.formLocalGroup__title_disabled, titleClassName)}
      >
        {title}
      </div>
      <div className="inputs">{children}</div>
    </div>
  );
}

FormLocalGroupLayout.defaultProps = {
  title: '',
  titleClassName: '',
};

FormLocalGroupLayout.propTypes = {
  title: PropTypes.string,
  titleClassName: PropTypes.string,
};
export default FormLocalGroupLayout;
