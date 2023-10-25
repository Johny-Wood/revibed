import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import ToolTip from '@/components/ui/ToolTip';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function ProjectUploadFiles({
  projectId,
  required,
  fileMaxSize,
  fileMinSize,
  formats,
  accept,
  pattern,

  showPopup,
}) {
  return (
    <div className="w-100pct">
      <div className="m-bottom-10 f-y-center">
        <b>
          Upload files
          {required && <span className="footnote-red" />}
        </b>
        <ToolTip width={230}>
          <>
            <b>Formats:</b> {formats}
            .
            <br />
            <b>Max size:</b> {fileMaxSize}
            MB
          </>
        </ToolTip>
      </div>
      <Button
        className={styles.uploadFiles__button}
        text="Upload"
        color="gray-4"
        size={ComponentsCommonConstants.Size.SMALL40}
        onClick={() => {
          showPopup(PopupProjectIdsConstants.ProjectUploadFilesPopup, {
            projectId,
            fileMaxSize,
            fileMinSize,
            accept,
            pattern,
          });
        }}
      />
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ProjectUploadFiles);
