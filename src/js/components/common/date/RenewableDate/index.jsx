import PropTypes from 'prop-types';

import UpdatedDate from '@/components/common/date/UpdatedDate';

function RenewableDate(props) {
  return <UpdatedDate {...props} />;
}

RenewableDate.defaultProps = {
  date: 0,
  withDescriptions: true,
  withIcon: true,
  withNormalizeDateWithTime: false,
  isTimer: false,
  direction: 'AGO',
  color: 'c-gray-2',
};

RenewableDate.propTypes = {
  date: PropTypes.number,
  withDescriptions: PropTypes.bool,
  withIcon: PropTypes.bool,
  withNormalizeDateWithTime: PropTypes.bool,
  isTimer: PropTypes.bool,
  direction: PropTypes.oneOf(['LEFT', 'AGO']),
  color: PropTypes.string,
};

export default RenewableDate;
