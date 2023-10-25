import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';

function RipperCabinetSave({
  projectTitle,
  projectCovers,
  text = CommonMessagesConstants.SAVE,
  disabled,
  statusName,

  projectId,
  realMediaCondition,
  realSleeveCondition,
  realConditionComment,
  comment,
  uploadedDocuments,
  uploadedExpenses,

  ripLink,
  ripComment,

  changeStatus,

  badRequest = () => {},

  showPopup,
  filesProps,
}) {
  return (
    <Button
      text={text}
      className="w-100pct m-top-30"
      disabled={disabled}
      onClick={() => {
        showPopup(PopupProjectIdsConstants.ProjectRipperSavePopup, {
          projectId,
          projectTitle,
          projectCovers,
          realMediaCondition,
          realSleeveCondition,
          realConditionComment,
          comment,
          uploadedDocuments,
          uploadedExpenses,
          statusName,
          ripLink,
          ripComment,
          changeStatus,
          badRequest,
          filesProps,
        });
      }}
    />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(RipperCabinetSave);
