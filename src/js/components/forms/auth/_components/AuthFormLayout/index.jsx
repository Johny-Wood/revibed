import classNames from 'classnames';
import PropTypes from 'prop-types';

import FormLayout from '@/components/layouts/FormLayout';

import styles from './styles.module.scss';

function AuthFormLayout({
  title,
  className,
  formContentClassName,

  children,
}) {
  return (
    <FormLayout
      title={title}
      className={classNames([styles.formAuth, className])}
      formContentClassName={classNames([styles.formAuth__content, formContentClassName])}
    >
      {children}
    </FormLayout>
  );
}

AuthFormLayout.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AuthFormLayout;
