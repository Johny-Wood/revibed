import { useState } from 'react';

import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import CheckBox from '@/components/ui/inputs/CheckBox';
import { CommonMessagesConstants } from '@/constants/common/message';
import { MessagesAskConstants } from '@/constants/messages/ask';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { loadWantListRequestAction, removeWantListReleaseRequestAction } from '@/redux-actions/wantList/wantListActions';
import { parseReplaceTextUtil, textForLotsOfUtil } from '@/utils/textUtils';

function RemoveWantListReleasePopup({
  popupId = PopupWantListIdsConstants.RemoveWantListReleasePopup,
  popupData: { count = 0, releases = [], activeReleasesCount = 0, name, releaseIds, callback = () => {} } = {},

  wantListSettings: { removingItems = false } = {},
  removeWantListReleaseInProcess,
  removeWantListReleaseRequest,
  closePopup,
  loadWantListRequest,
  loadWantListInProcess,
  loadWantListFromApi,
  wantListPageSettings: { page: { size: wantListPageSize } = {} } = {},
  showMessage,
}) {
  const [syncWithDiscogs, setSyncWithDiscogs] = useState(removingItems);

  const disabledRemove = () => removeWantListReleaseInProcess || loadWantListInProcess;

  const parseText = (text = '') => parseReplaceTextUtil(text, `${count || ''}`);

  return (
    <Popup
      popupId={popupId}
      headerText={`${parseText(MessagesAskConstants.WANT_LIST_REMOVE_RELEASE)} ${
        count ? textForLotsOfUtil(count, ['release', 'releases']) : 'release'
      }?`}
      maxWidth={500}
    >
      {name && <PopupTextContent>{name}</PopupTextContent>}
      <CheckBox
        className="m-top-25 f-y-center"
        id="synchronizeDiscogs"
        checked={syncWithDiscogs}
        label="Synchronize with Discogs"
        onChange={() => {
          setSyncWithDiscogs(!syncWithDiscogs);
        }}
      />
      <PopupDoubleButtons
        popupId={popupId}
        closePopup={closePopup}
        okButtonText={CommonMessagesConstants.REMOVE}
        okButtonInProcess={removeWantListReleaseInProcess || loadWantListInProcess}
        okButtonDisables={disabledRemove()}
        okButtonOnClick={() =>
          new Promise((resolve, reject) => {
            if (disabledRemove()) {
              reject();
              return;
            }

            removeWantListReleaseRequest({
              releaseIds,
              releases,
              syncWithDiscogs,
              activeReleasesCount,
            })
              .then(() => {
                callback();
                closePopup(popupId);
                showMessage('SuccessMessage', {
                  messageText: MessagesSuccessConstants.WANT_LIST_DELETE_RELEASES,
                });

                if (loadWantListFromApi) {
                  loadWantListRequest({ pageSize: wantListPageSize })
                    .then(() => {
                      resolve();
                    })
                    .catch(() => reject());
                } else {
                  resolve();
                }
              })
              .catch(() => {
                reject();
                closePopup(popupId);
              });
          })
        }
      />
    </Popup>
  );
}

export default connect(
  (state) => ({
    wantListSettings: state.AuthReducer.userInfo.wantListSettings,
    removeWantListReleaseInProcess: state.WantListReducer.removeWantListReleaseInProcess,
    wantListPageSettings: state.WantListReducer.wantListPageSettings,
    loadWantListInProcess: state.WantListReducer.loadWantListInProcess,
    loadWantListFromApi: state.WantListReducer.loadWantListFromApi,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    removeWantListReleaseRequest: (params) => removeWantListReleaseRequestAction(params)(dispatch),
    loadWantListRequest: (params) => loadWantListRequestAction(params)(dispatch),
  })
)(RemoveWantListReleasePopup);
