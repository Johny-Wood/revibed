import PropTypes from 'prop-types';

import Flag from '@/components/common/Flag';

function UserFlag({ country, className, alias }) {
  return <Flag country={country} className={className} alias={alias} />;
}

UserFlag.defaultProps = {
  country: '',
  className: '',
};

UserFlag.propTypes = {
  country: PropTypes.string,
  className: PropTypes.string,
};

export default UserFlag;
