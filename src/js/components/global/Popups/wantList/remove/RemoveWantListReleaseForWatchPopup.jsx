import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import { CommonMessagesConstants } from '@/constants/common/message';
import { MessagesAskConstants } from '@/constants/messages/ask';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { deleteWatchWantListReleaseRequestAction } from '@/redux-actions/wantList/wantListActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { parseReplaceTextUtil } from '@/utils/textUtils';

function RemoveWantListReleaseForWatchPopup({
  popupData: { ids = [] } = {},
  popupId = PopupWantListIdsConstants.RemoveWantListReleaseForWatchPopup,

  deleteWatchWantListReleaseInProcess,
  deleteWatchWantListReleaseRequest,

  closePopup,
  showPopup,
}) {
  const disabledAdd = () => deleteWatchWantListReleaseInProcess;

  const parseText = (text = '') => parseReplaceTextUtil(text, `${ids.length}`);

  return (
    <Popup popupId={popupId} headerText={parseText(MessagesAskConstants.WANT_LIST_REMOVE_RELEASE_FROM_WATCH)} maxWidth={500}>
      <PopupDoubleButtons
        popupId={popupId}
        closePopup={closePopup}
        okButtonText={CommonMessagesConstants.REMOVE}
        okButtonDisables={disabledAdd()}
        okButtonInProcess={deleteWatchWantListReleaseInProcess}
        okButtonOnClick={() =>
          new Promise((resolve, reject) => {
            deleteWatchWantListReleaseRequest(ids)
              .then(() => {
                closePopup(popupId);
                resolve();
              })
              .catch(({ error = {} }) => {
                if (error) {
                  handleErrorUtil(error, {
                    WANT_LIST_SUBSCRIPTION_NO_PLACES: () => {
                      showPopup(PopupWantListIdsConstants.WantListSubscriptionNoPlacesPopup);
                    },
                  });

                  closePopup(PopupWantListIdsConstants.AddWantListReleaseForWatchPopup);
                  closePopup(popupId);

                  reject();
                }
              });
          })
        }
      />
    </Popup>
  );
}

export default connect(
  (state) => ({
    deleteWatchWantListReleaseInProcess: state.WantListReducer.deleteWatchWantListReleaseInProcess,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    deleteWatchWantListReleaseRequest: (ids) => deleteWatchWantListReleaseRequestAction(ids)(dispatch),
  })
)(RemoveWantListReleaseForWatchPopup);
