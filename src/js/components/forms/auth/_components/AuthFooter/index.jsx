import classNames from 'classnames';
import PropTypes from 'prop-types';

import LinkRoute from '@/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

function AuthFooter({
  isCenter,
  message: { messageText, messageClass } = {},
  button: { buttonText, buttonHref, buttonHrefParams, buttonClass },
}) {
  return (
    <div className={classNames([styles.authFormFooter, isCenter && 'f-x-center'])}>
      <span className={messageClass}>{messageText}</span>
      <LinkRoute
        href={{
          pathname: `${buttonHref}`,
          query: buttonHrefParams,
        }}
        text={buttonText}
        className={buttonClass}
      />
    </div>
  );
}

AuthFooter.defaultProps = {
  message: {
    messageText: '',
    messageClass: '',
  },
  button: {
    buttonText: '',
    buttonClass: '',
    buttonHref: '',
  },
  isCenter: false,
};

AuthFooter.propTypes = {
  message: PropTypes.object,
  button: PropTypes.object,
  isCenter: PropTypes.bool,
};

export default AuthFooter;
