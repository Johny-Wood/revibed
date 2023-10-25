import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function EventMarkerEvent({ withRead, className }) {
  return <span className={classNames(styles.eventMarker, withRead && styles.eventMarker_not_active, className)} />;
}

EventMarkerEvent.defaultProps = {
  withRead: false,
  className: '',
};

EventMarkerEvent.propTypes = {
  withRead: PropTypes.bool,
  className: PropTypes.string,
};

export default EventMarkerEvent;
