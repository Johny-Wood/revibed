import PropTypes from 'prop-types';

import Timer from '@/components/common/Timer';

function ConfirmTimer({ notFastLeft, changeNotFastLeft }) {
  return (
    <Timer
      className="c-gray-1"
      endDate={new Date().valueOf() + notFastLeft}
      endDateCallback={() => changeNotFastLeft(0)}
      formats={['minutes', 'seconds']}
    />
  );
}

ConfirmTimer.propTypes = {
  notFastLeft: PropTypes.number.isRequired,
  changeNotFastLeft: PropTypes.func.isRequired,
};

export default ConfirmTimer;
