import { useMemo } from 'react';

import size from 'lodash/size';
import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import Button from '@/components/ui/buttons/Button';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import {
  deleteUnreadPersonalNotificationCountsEventRequestAction,
  deleteUnreadPersonalNotificationCountsEventSectionAction,
} from '@/redux-actions/personal/personalNotificationCountsActions';

function MarkAsReadButton({ readCallback, unreadEvents, deleteUnreadEventRequest, deleteUnreadEventSectionAction }) {
  const { PERSONAL_EVENTS_FEED = {} } = useMemo(() => unreadEvents[0] || {}, [unreadEvents]);

  return (
    <TransitionSwitchLayout isShown={!!size(PERSONAL_EVENTS_FEED)}>
      <Button
        text="Mark as read"
        type="button_string"
        className="c-blue m-left-auto t-semi-bold text_size_12"
        onClick={() => {
          deleteUnreadEventRequest().then(() => {
            deleteUnreadEventSectionAction();

            if (readCallback) {
              readCallback();
            }
          });
        }}
      />
    </TransitionSwitchLayout>
  );
}

export default connect(
  (state) => ({
    unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
  }),
  (dispatch) => ({
    deleteUnreadEventSectionAction: () => {
      dispatch(
        deleteUnreadPersonalNotificationCountsEventSectionAction({
          sections: [PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED],
        })
      );
    },
    deleteUnreadEventRequest: (ids = []) =>
      deleteUnreadPersonalNotificationCountsEventRequestAction(
        ids,
        PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED
      )(dispatch),
  })
)(MarkAsReadButton);
