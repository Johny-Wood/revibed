import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import { CommonMessagesConstants } from '@/constants/common/message';
import ComponentsCommonConstants from '@/constants/components/common';
import { MessagesAskConstants } from '@/constants/messages/ask';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { addWatchWantListReleaseRequestAction } from '@/redux-actions/wantList/wantListActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { parseReplaceTextUtil } from '@/utils/textUtils';

function AddWantListReleaseForWatchPopup({
  popupData: { ids = [] } = {},

  popupId = PopupWantListIdsConstants.AddWantListReleaseForWatchPopup,

  addWatchWantListReleaseInProcess,
  addWatchWantListReleaseRequest,

  closePopup,
  showPopup,
}) {
  const disabledAdd = () => addWatchWantListReleaseInProcess;

  const parseText = (text = '') => parseReplaceTextUtil(text, `${ids.length}`);

  return (
    <Popup
      popupId={popupId}
      headerText={parseText(MessagesAskConstants.WANT_LIST_ADD_RELEASE_TO_WATCH)}
      size={ComponentsCommonConstants.Size.LARGE}
      maxWidth={500}
    >
      <PopupDoubleButtons
        popupId={popupId}
        closePopup={closePopup}
        okButtonText={CommonMessagesConstants.ADD}
        okButtonDisables={disabledAdd()}
        okButtonInProcess={addWatchWantListReleaseInProcess}
        okButtonOnClick={() =>
          new Promise((resolve, reject) => {
            addWatchWantListReleaseRequest(ids)
              .then(() => {
                closePopup(PopupWantListIdsConstants.AddWantListReleaseForWatchPopup);
                resolve();
              })
              .catch(({ error = {} }) => {
                if (error) {
                  closePopup(PopupWantListIdsConstants.AddWantListReleaseForWatchPopup);

                  handleErrorUtil(error, {
                    WANT_LIST_SUBSCRIPTION_NO_PLACES: () => {
                      showPopup(PopupWantListIdsConstants.WantListSubscriptionNoPlacesPopup);
                    },
                  });
                }

                reject();
              });
          })
        }
      />
    </Popup>
  );
}

export default connect(
  (state) => ({
    addWatchWantListReleaseInProcess: state.WantListReducer.addWatchWantListReleaseInProcess,
  }),
  (dispatch) => ({
    addWatchWantListReleaseRequest: (ids) => addWatchWantListReleaseRequestAction(ids)(dispatch),
  })
)(AddWantListReleaseForWatchPopup);
