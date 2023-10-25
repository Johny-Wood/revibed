import classNames from 'classnames';
import PropTypes from 'prop-types';

import SecuredIcon from '@/icons/project/state/SecuredIcon';

function SecuredLabel({ withDescription }) {
  return (
    <span
      className={classNames('status__label status__label_secured', !withDescription && 'status__label_without_description')}
      title={!withDescription ? 'Secured' : ''}
    >
      <SecuredIcon />
      {withDescription && <span className="text">secured</span>}
    </span>
  );
}

SecuredLabel.defaultProps = {
  withDescription: true,
};

SecuredLabel.propTypes = {
  withDescription: PropTypes.bool,
};

export default SecuredLabel;
