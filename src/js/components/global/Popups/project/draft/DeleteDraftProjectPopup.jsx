import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import PopupDoubleButtons from '@/components/primary/Popup/_components/PopupDoubleButtons';
import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import { CommonMessagesConstants } from '@/constants/common/message';
import ComponentsCommonConstants from '@/constants/components/common';
import { MessagesAskConstants } from '@/constants/messages/ask';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { deleteProjectRequestAction } from '@/redux-actions/create-project/createProjectActions';

function DeleteDraftProjectPopup({
  popupData: { projectId, location } = {},
  popupId = PopupProjectIdsConstants.DeleteDraftProjectPopup,

  deleteProjectInProcess,
  deleteProjectRequest,

  showPopup,
  closePopup,
}) {
  const disabledDeleteProject = () => !projectId || deleteProjectInProcess;

  const onDeleteProject = () =>
    new Promise((resolve, reject) => {
      if (disabledDeleteProject()) {
        reject();
        return;
      }

      deleteProjectRequest({ projectId, location })
        .then(() => {
          resolve();
          showPopup(PopupProjectIdsConstants.DeleteDraftProjectSuccessPopup);
        })
        .catch(() => reject());
    });

  return (
    <Popup
      popupId={popupId}
      headerText={MessagesAskConstants.DELETE_DRAFT}
      size={ComponentsCommonConstants.Size.LARGE}
      maxWidth={400}
    >
      <PopupTextContent>You are about to&nbsp;delete your pre-order. Proceed?</PopupTextContent>
      <PopupDoubleButtons
        popupId={popupId}
        closePopup={closePopup}
        okButtonText={CommonMessagesConstants.REMOVE}
        okButtonInProcess={deleteProjectInProcess}
        okButtonDisables={disabledDeleteProject()}
        okButtonOnClick={onDeleteProject}
      />
    </Popup>
  );
}

export default connect(
  (state) => ({
    deleteProjectInProcess: state.CreateProjectReducer.deleteProjectInProcess,
  }),
  (dispatch) => ({
    deleteProjectRequest: ({ projectId, location }) => deleteProjectRequestAction({ projectId, location, dispatch }),
  })
)(DeleteDraftProjectPopup);
