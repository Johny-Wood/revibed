import parse from 'html-react-parser';
import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import { CommonMessagesConstants } from '@/constants/common/message';
import ComponentsCommonConstants from '@/constants/components/common';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import NextRouter from '@/services/NextRouter';

function WantListSubscriptionNoPlacesPopup({
  closePopup,
  popupId = PopupWantListIdsConstants.WantListSubscriptionNoPlacesPopup,
}) {
  return (
    <Popup
      popupId={popupId}
      headerText="Add selected releases to watching?"
      size={ComponentsCommonConstants.Size.LARGE}
      textAlign="left"
      maxWidth={500}
    >
      <>
        <PopupTextContent className="c-black">{parse(MessagesErrorConstants.WANT_LIST_SUBSCRIPTION_NO_PLACES)}</PopupTextContent>
        <PopupDoubleButtons
          popupId={popupId}
          closePopup={closePopup}
          okButtonText={CommonMessagesConstants.UPGRADE_PLAN}
          okButtonOnClick={() =>
            new Promise((resolve, reject) => {
              const { router = {} } = NextRouter.getInstance();

              router
                .push(RoutePathsConstants.WANTLIST_PLAN)
                .then(() => resolve())
                .catch(() => reject());
            })
          }
          okButtonBorderColor="green"
        />
      </>
    </Popup>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(WantListSubscriptionNoPlacesPopup);
