import { forwardRef } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const ProfileFormLayout = forwardRef((props, ref) => {
  const {
    id,
    title,
    name,
    shortColumn,

    children,

    formContentClassName,
    outFormContent: OutFormContent,
  } = props;

  return (
    <div ref={ref} className={classNames(styles.formSettings, name)} id={id}>
      {!!title && (
        <h4>
          <b>{title}</b>
        </h4>
      )}
      {!!OutFormContent && <OutFormContent />}
      <div
        className={classNames(
          styles.formSettingsContent,
          formContentClassName,
          shortColumn && styles.formSettingsContent_shortColumn
        )}
      >
        {children}
      </div>
    </div>
  );
});

ProfileFormLayout.defaultProps = {
  shortColumn: true,
  id: '',
  title: '',
  name: '',
  outFormContent: null,
};

ProfileFormLayout.propTypes = {
  shortColumn: PropTypes.bool,

  id: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  outFormContent: PropTypes.any,
};

ProfileFormLayout.displayName = 'ProfileFormLayout';

export default ProfileFormLayout;
