import classNames from 'classnames';

import styles from './styles.module.scss';

type EventMarkerEventProps = {
  withRead?: boolean;
  className?: string;
};

function EventMarkerEvent({ withRead, className }: EventMarkerEventProps) {
  return <span className={classNames(styles.eventMarker, withRead && styles.eventMarker_not_active, className)} />;
}

export default EventMarkerEvent;
