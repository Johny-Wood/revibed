import PropTypes from 'prop-types';

import EventMarkerEvent from '@/components/events/EventMarker/_components/EventMarkerEvent';

function EventMarker({ shown, withRead, className }) {
  if (!shown && !withRead) {
    return null;
  }

  return <EventMarkerEvent className={className} withRead={withRead} />;
}

EventMarker.defaultProps = {
  shown: false,
  withRead: false,
  className: '',
};

EventMarker.propTypes = {
  shown: PropTypes.bool,
  withRead: PropTypes.bool,
  className: PropTypes.string,
};

export default EventMarker;
