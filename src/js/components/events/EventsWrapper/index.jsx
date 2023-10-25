import { Component } from 'react';

import difference from 'lodash/difference';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  deleteUnreadPersonalNotificationCountsEventAction,
  deleteUnreadPersonalNotificationCountsEventRequestAction,
} from '@/redux-actions/personal/personalNotificationCountsActions';

class EventsWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sentUnreadEvents: [],
    };
  }

  componentDidMount() {
    this.triggerMountedDelete();
  }

  componentDidUpdate(prevProps) {
    const { eventsIds, isStartDeleteUnreadEventsMarkers } = this.props;

    const { eventsIds: eventsIdsPrev, isStartDeleteUnreadEventsMarkers: isStartDeleteUnreadEventsMarkersPrev } = prevProps;

    if (eventsIds.length !== eventsIdsPrev.length && eventsIds.length > 0) {
      this.deleteUnreadEvents();
    }

    if (isStartDeleteUnreadEventsMarkers !== isStartDeleteUnreadEventsMarkersPrev && isStartDeleteUnreadEventsMarkers) {
      this.deleteUnreadMarkers({ eventsIdsPrev });
    }
  }

  componentWillUnmount() {
    this.triggerUnMountedDelete();
  }

  triggerMountedDelete = () => {
    const { fastRemoveMarkers } = this.props;

    if (fastRemoveMarkers) {
      this.deleteUnreadMarkers();
    }

    this.deleteUnreadEvents();
  };

  triggerUnMountedDelete = () => {
    this.deleteUnreadMarkers();
  };

  deleteUnreadEvents = () => {
    const {
      eventsIds = [],
      location,
      userIsAuthorized,
      readAllLocation,

      deleteUnreadEventRequest,
    } = this.props;

    const { sentUnreadEvents } = this.state;

    const eventsIdsNew = difference(eventsIds, sentUnreadEvents) || [];

    if (!userIsAuthorized || eventsIdsNew.length === 0) {
      return;
    }

    this.setState({
      sentUnreadEvents: eventsIdsNew,
    });

    deleteUnreadEventRequest(!readAllLocation ? eventsIdsNew : [], location).then(() => {
      this.setState({
        sentUnreadEvents: eventsIdsNew,
      });
    });
  };

  deleteUnreadMarkers = ({ eventsIdsPrev } = {}) => {
    const {
      eventsIds = [],
      location,
      userIsAuthorized,
      deleteFromAllProjects,

      deleteUnreadEventAction,
    } = this.props;

    const eventsIdsOld = eventsIdsPrev || eventsIds || [];

    if (!userIsAuthorized || eventsIdsOld.length === 0) {
      return;
    }

    deleteUnreadEventAction(eventsIdsOld, { location, deleteFromAllProjects });
  };

  render() {
    const { children } = this.props;

    return children;
  }
}

EventsWrapper.defaultProps = {
  location: undefined,
  deleteFromAllProjects: true,
  fastRemoveMarkers: false,
  readAllLocation: false,
  isStartDeleteUnreadEventsMarkers: false,
};

EventsWrapper.propTypes = {
  eventsIds: PropTypes.array.isRequired,
  location: PropTypes.string,
  deleteFromAllProjects: PropTypes.bool,
  fastRemoveMarkers: PropTypes.bool,
  readAllLocation: PropTypes.bool,
  isStartDeleteUnreadEventsMarkers: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export default connect(
  (state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    getUnreadEventsInProcess: state.PersonalNotificationCountsReducer.getUnreadEventsInProcess,
  }),
  (dispatch) => ({
    deleteUnreadEventRequest: (ids = [], location) =>
      deleteUnreadPersonalNotificationCountsEventRequestAction(ids, location)(dispatch),
    deleteUnreadEventAction: (ids, params = {}) => {
      dispatch(deleteUnreadPersonalNotificationCountsEventAction(ids, params));
    },
  })
)(EventsWrapper);
