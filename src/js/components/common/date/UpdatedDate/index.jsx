import { useCallback, useEffect, useRef, useState } from 'react';

import DateInfo from '@/components/common/date/DateInfo';
import { PreviousHook } from '@/hooks/state/PreviousHook';

const UPDATE_TIME = 60000;

function UpdatedDate({ date, direction, withNormalizeDateWithTime, ...dateProps }) {
  const prevDirection = PreviousHook(direction);

  const timer = useRef(null);

  const [triggerUpdateDateFormatted, setTriggerUpdateDateFormatted] = useState(0);
  const [triggerUpdateDateTitle, setTriggerUpdateDateTitle] = useState(0);

  const stopTimerUpdateDate = useCallback(() => {
    clearInterval(timer.current);
  }, []);

  const startTimerUpdateDate = useCallback(() => {
    stopTimerUpdateDate();

    if (!date) {
      return;
    }

    timer.current = setInterval(() => {
      setTriggerUpdateDateFormatted(new Date().valueOf());
    }, UPDATE_TIME);
  }, [date, stopTimerUpdateDate]);

  const updateDateFromLocal = useCallback(() => {
    setTriggerUpdateDateFormatted(triggerUpdateDateFormatted + 1);
    setTriggerUpdateDateTitle(triggerUpdateDateTitle + 1);
  }, [triggerUpdateDateFormatted, triggerUpdateDateTitle]);

  useEffect(
    () => () => {
      stopTimerUpdateDate();
    },
    [stopTimerUpdateDate]
  );

  useEffect(() => {
    startTimerUpdateDate();
  }, [startTimerUpdateDate]);

  useEffect(() => {
    if (direction !== prevDirection) {
      stopTimerUpdateDate();
      updateDateFromLocal();
      startTimerUpdateDate();
    }
  }, [direction, prevDirection, startTimerUpdateDate, stopTimerUpdateDate, updateDateFromLocal]);

  return (
    <DateInfo
      date={date}
      direction={direction}
      withNormalizeDateWithTime={withNormalizeDateWithTime}
      triggerUpdateDateFormatted={triggerUpdateDateFormatted}
      triggerUpdateDateTitle={triggerUpdateDateTitle}
      {...dateProps}
    />
  );
}

export default UpdatedDate;
