import { useEffect, useMemo, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import { getDateFormatUtil, normalizeDateUtil, normalizeDateUtilAgoUtil } from '@/utils/dateUtils';

const UPDATE_TIME = 60000;

function NormalizeDate({ date, type, className }) {
  const timer = useRef(null);
  const time = useRef(1);

  const [updateTime, setUpdateTime] = useState(time);

  useEffect(() => {
    timer.current = setInterval(() => {
      time.current += 1;

      setUpdateTime(time.current);
    }, UPDATE_TIME);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  const typeDateMethod = useMemo(() => {
    if (type === 'AGO') {
      return normalizeDateUtilAgoUtil(date, false);
    }

    return normalizeDateUtil(date);
  }, [date, type]);

  return (
    <span className={className} title={getDateFormatUtil(date)}>
      <span>{!!updateTime && typeDateMethod}</span>
    </span>
  );
}

NormalizeDate.defaultProps = {
  date: 0,
  type: 'NORMAL',
};

NormalizeDate.propTypes = {
  date: PropTypes.number,
  type: PropTypes.oneOf(['NORMAL', 'AGO']),
};

export default NormalizeDate;
